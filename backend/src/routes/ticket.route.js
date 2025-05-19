import { Router } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import { createComment, createTicket, deleteComment, getAllTickets, getTicket, updateTicket } from '../controllers/ticket.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protectRoute)

router.route('/')
  .post(catchAsync(createTicket))
  .get(catchAsync(getAllTickets))

router.route('/:ticketId')
  .get(catchAsync(getTicket))
  .put(catchAsync(updateTicket))

router.post('/:ticketId/comments', catchAsync(createComment))
router.delete('/:ticketId/comments/:commentId', catchAsync(deleteComment))

export default router