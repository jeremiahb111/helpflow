import { StatusCodes } from "http-status-codes"
import { AppError } from "../utils/errorHandler.js"
import { verifyToken } from "../lib/jwt.js"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  const session = req.cookies['session']

  if (!session) throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized - Session token is required')

  const { userId } = await verifyToken(session)

  const user = await User.findById({ _id: userId }).select('-password')

  if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized - User not found')

  req.user = user

  next()
}

export const isAdmin = async (req, res, next) => {
  const { role } = req.user

  if (role !== 'admin') throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden - You must be admin to perform this action')

  next()
}