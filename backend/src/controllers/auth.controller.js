import { StatusCodes } from "http-status-codes"
import validator from "validator"
import { AppError } from "../utils/errorHandler.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { generateToken } from "../lib/jwt.js"

export const signup = async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body

  if (!fullName || !email || !password || !confirmPassword) throw new AppError(StatusCodes.BAD_REQUEST, 'All fields are required')

  if (!validator.isEmail(email)) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid email address')

  if (!validator.isStrongPassword(password)) throw new AppError(StatusCodes.BAD_REQUEST, 'Password is not strong enough')

  if (password !== confirmPassword) throw new AppError(StatusCodes.BAD_REQUEST, 'Password does not match')

  const isUserExist = await User.findOne({ email })

  if (isUserExist) throw new AppError(StatusCodes.BAD_REQUEST, 'Email already taken')

  const randomNumber = Math.floor(Math.random() * 100) + 1

  const randomAvatar = `https://avatar.iran.liara.run/public/${randomNumber}.png`

  let user = await User.create({ fullName, email, password, avatar: randomAvatar })

  generateToken(res, user._id)

  user = user.toObject()

  delete user.password

  const admins = await User.find({ role: 'admin', isActive: true }).select('_id')

  const isReadByUser = admins.map(admin => ({ user: admin._id }))

  await Notification.create({
    relatedUser: user._id,
    type: 'userCreated',
    recipients: admins,
    isReadByUser
  })

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User created successfully',
    data: user
  })
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) throw new AppError(StatusCodes.BAD_REQUEST, 'All fields are required')

  let user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) throw new AppError(StatusCodes.BAD_REQUEST, 'Email or password is incorrect')

  if (!user.isActive) throw new AppError(StatusCodes.BAD_REQUEST, 'Your account is disabled. Please contact support team for more information.')

  generateToken(res, user._id)

  user = user.toObject()

  delete user.password

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User logged in successfully',
    data: user
  })
}

export const logout = async (req, res, next) => {
  res.clearCookie('session').status(StatusCodes.OK).json({
    success: true,
    message: 'User logged out successfully'
  })
}