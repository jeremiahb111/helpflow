import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errorHandler.js'
import { StatusCodes } from 'http-status-codes'

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
}

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return reject(new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized - Invalid token'))
      return resolve(decoded)
    })
  })
}