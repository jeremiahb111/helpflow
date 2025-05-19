import { Router } from 'express'
import { catchAsync } from '../utils/catchAsync.js'
import { getCurrentUser, getUsers, updateUser } from '../controllers/user.controller.js'
import { isAdmin, protectRoute } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protectRoute)

router.get('/', isAdmin, catchAsync(getUsers))
router.get('/me', catchAsync(getCurrentUser))
router.put('/:userId/update', isAdmin, catchAsync(updateUser))

export default router