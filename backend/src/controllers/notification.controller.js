import { StatusCodes } from "http-status-codes"
import Notification from "../models/notification.model.js"
import { AppError } from "../utils/errorHandler.js"

export const getAllNotifications = async (req, res) => {
  const user = req.user

  const notifications = await Notification.find({
    recipients: { $in: [user._id] }
  }).populate('relatedUser', 'fullName email avatar');

  notifications.sort((a, b) => {
    const aUnread = a.isReadByUser.some(r => r.user.equals(user._id) && !r.read);
    const bUnread = b.isReadByUser.some(r => r.user.equals(user._id) && !r.read);

    if (aUnread !== bUnread) return aUnread ? -1 : 1; // unread first
    return b.createdAt - a.createdAt; // newest first
  });

  if (!notifications) throw new AppError(StatusCodes.NOT_FOUND, 'Notifications not found')

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Notifications fetched successfully',
    data: notifications
  })
}

export const markAsReadNotification = async (req, res) => {
  const user = req.user
  const { notificationId } = req.params

  const notification = await Notification.findById(notificationId).lean()

  if (!notification) throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found')

  const hasUser = notification.isReadByUser.find(item => item.user.toString() === user._id.toString())

  if (!hasUser) throw new AppError(StatusCodes.BAD_REQUEST, 'You are not allowed to mark this notification as read')

  const isRead = !hasUser.read

  await Notification.updateOne(
    {
      _id: notificationId,
      'isReadByUser.user': user._id
    },
    {
      $set: {
        'isReadByUser.$.read': isRead
      }
    }
  )

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Notification marked as read successfully'
  })
}

export const deleteNotification = async (req, res) => {
  const user = req.user
  const { notificationId } = req.params

  const notification = await Notification.findById(notificationId)

  if (!notification) throw new AppError(StatusCodes.NOT_FOUND, 'Notification not found').lean()

  const inRecipients = notification.recipients.some(item => item.toString() === user._id.toString())

  if (!inRecipients) throw new AppError(StatusCodes.BAD_REQUEST, 'You are not allowed to delete this notification')

  const hasUser = notification.isReadByUser.find(item => item.user.toString() === user._id.toString())

  if (notification.recipients.length === 1) {
    await Notification.findByIdAndDelete(notificationId)
  } else {
    await Notification.updateOne(
      {
        _id: notificationId
      },
      {
        $pull: {
          recipients: user._id,
          isReadByUser: hasUser
        }
      }
    )
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Notification deleted successfully'
  })
}