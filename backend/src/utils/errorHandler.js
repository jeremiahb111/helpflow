import { StatusCodes } from 'http-status-codes'

export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (error, req, res, next) => {
  console.error(`${req.originalUrl}: ${error.message}`)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    })
  } else if (error.name === 'ValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error'
  })
}