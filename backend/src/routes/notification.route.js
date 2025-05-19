import { Router } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { deleteNotification, getAllNotifications, markAsReadNotification } from '../controllers/notification.controller.js'

const router = Router()

router.use(protectRoute)

router.get('/', catchAsync(getAllNotifications))
router.delete('/:notificationId', catchAsync(deleteNotification))
router.put('/:notificationId/mark-as-read', catchAsync(markAsReadNotification))

export default router