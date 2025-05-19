import { StatusCodes } from "http-status-codes"
import Ticket from "../models/ticket.model.js"
import { uploadImage } from "../lib/cloudinary.js"
import { generateTicketId } from "../utils/generateId.js"
import { AppError } from "../utils/errorHandler.js"
import Comment from "../models/comment.model.js"
import Notification from "../models/notification.model.js"

export const createTicket = async (req, res, next) => {
  const user = req.user

  let { title, description, image, priority } = req.body

  if (!title || !description || !priority) throw new AppError(StatusCodes.BAD_REQUEST, 'All fields are required')

  const lastTicketId = await Ticket.findOne({
    ticketId: {
      $regex: `^${process.env.TICKET_PREFIX}`
    }
  }).select('ticketId').sort({ createdAt: -1 })

  const newTicketId = generateTicketId(lastTicketId)

  let newTicket = new Ticket({ ticketId: newTicketId, title, description, priority, createdBy: user._id })

  let uploadImg

  if (image) {
    uploadImg = await uploadImage(image)
    newTicket.image = uploadImg
  }

  await newTicket.save()

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Ticket created successfully',
    data: newTicket
  })
}

export const getAllTickets = async (req, res, next) => {
  const user = req.user
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 13

  const isPriviledgedUser = user.role === 'admin' || user.role === 'agent'

  const filters = Object.keys(req.query).reduce((acc, key) => {
    if (key === 'page') {
      delete req.query.page
    } else if (req.query[key] === '') {
      acc
    } else if (key === 'ticketId') {
      acc[key] = new RegExp(req.query[key], 'i')
    } else {
      acc[key] = req.query[key]
    }

    return acc
  }, {})

  if (!isPriviledgedUser) {
    filters.createdBy = user._id
  }

  const tickets = await Ticket.find(filters).populate([
    {
      path: 'createdBy',
      select: '-password -createdAt -updatedAt -role -isActive'
    },
    {
      path: 'assignedTo',
      select: '-password -createdAt -updatedAt -role -isActive'
    }
  ]).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })

  const totalTickets = await Ticket.countDocuments(filters)

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Tickets fetched successfully',
    data: {
      tickets,
      page,
      limit,
      totalPages: Math.ceil(totalTickets / limit),
      totalItems: totalTickets
    }
  })
}

export const getTicket = async (req, res, next) => {
  const { ticketId } = req.params

  const ticket = await Ticket.findById({ _id: ticketId }).populate([
    {
      path: 'createdBy',
      select: '-password -createdAt -updatedAt -isActive'
    },
    {
      path: 'assignedTo',
      select: '-password -createdAt -updatedAt -isActive'
    },
    {
      path: 'comments',
      populate: {
        path: 'author',
        select: '-password -createdAt -updatedAt -isActive'
      }
    }
  ])

  if (!ticket) throw new AppError(StatusCodes.NOT_FOUND, 'Ticket not found')

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Ticket fetched successfully',
    data: ticket
  })
}

export const updateTicket = async (req, res, next) => {
  const user = req.user
  const { ticketId } = req.params

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) throw new AppError(StatusCodes.NOT_FOUND, 'Ticket not found')

  const isCreatedByUser = ticket.createdBy.toString() === user._id.toString()
  const allowedUpdates = isCreatedByUser ? ['title', 'description', 'image', 'priority', 'status'] : ['status']

  if (isCreatedByUser) throw new AppError(StatusCodes.BAD_REQUEST, 'You can\'t assign your filed ticket to yourself')

  if ((!req.body && user.role === 'agent') || (req.body['assignedTo'] && user.role === 'admin')) {

    if (ticket.assignedTo) throw new AppError(StatusCodes.BAD_REQUEST, 'Request body must not be empty')

    ticket.assignedTo = req.body ? req.body.assignedTo : user._id
    const recipients = user?.role === 'agent' ? [ticket.createdBy] : [ticket.createdBy, req.body.assignedTo]

    await Notification.create({
      recipients: recipients,
      relatedTicket: ticket._id,
      type: 'assignedTicket',
      isReadByUser: recipients.map(item => ({ user: item }))
    })
  } else {
    const updateData = Object.keys(req.body).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
        acc[key] = req.body[key]
      } else {
        acc
      }
      return acc
    }, {})

    ticket.set(updateData)
  }

  await ticket.save()

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Ticket updated successfully',
    data: ticket
  })
}

export const createComment = async (req, res, next) => {
  const user = req.user
  const { ticketId } = req.params
  const { comment } = req.body

  if (!comment) throw new AppError(StatusCodes.BAD_REQUEST, 'Comment is required')

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) throw new AppError(StatusCodes.NOT_FOUND, 'Ticket not found')

  if ((ticket.createdBy.toString() !== user._id.toString()) && (ticket.assignedTo.toString() !== user._id.toString()) && user.role !== 'admin') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You are not allowed to comment on this ticket')
  }

  const newComment = new Comment({ ticketId, author: user._id, content: comment.content })

  if (comment.image) {
    const uploadImg = await uploadImage(comment.image)
    newComment.image = uploadImg
  }

  ticket.comments.push(newComment._id)

  const recipients = user?._id.toString() === ticket.createdBy.toString() ? [ticket.assignedTo] : [ticket.createdBy]

  if (ticket.assignedTo) {
    await Notification.create({
      recipients,
      relatedTicket: ticket._id,
      type: 'comment',
      isReadByUser: recipients.map(user => ({ user }))
    })
  }

  await Promise.all([newComment.save(), ticket.save()])

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Comment created successfully',
    data: newComment
  })
}

export const deleteComment = async (req, res, next) => {
  const user = req.user
  const { ticketId, commentId } = req.params

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) throw new AppError(StatusCodes.NOT_FOUND, 'Ticket not found')

  const comment = await Comment.findById(commentId)

  if (!comment) throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found')

  if (comment.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You are not allowed to delete this comment')
  }

  if (comment.image) {
    await deleteImage(comment.image.split('/').pop().split('.')[0])
  }

  await Comment.findByIdAndDelete(commentId)

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Comment deleted successfully'
  })
}
