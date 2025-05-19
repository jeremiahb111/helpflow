import { StatusCodes } from "http-status-codes"
import { AppError } from "../utils/errorHandler.js"
import User from "../models/user.model.js"

export const getUsers = async (req, res, next) => {
  let { page, ...query } = req.query;
  page = parseInt(page) || 1
  const limit = parseInt(req.query.limit) || 13

  const filters = [];

  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;

    switch (key) {
      case 'status':
        filters.push({ isActive: value });
        break;

      case 'userIdentifier':
        filters.push({
          $or: [
            { email: { $regex: value, $options: 'i' } },
            { fullName: { $regex: value, $options: 'i' } }
          ]
        });
        break;

      case 'type':
        filters.push({ role: value });
        break;
    }
  }

  filters.push({ role: { $ne: 'admin' } });

  const users = await User.find(filters.length ? { $and: filters } : {})
    .skip((page - 1) * limit).limit(limit).select('-password').sort({ createdAt: -1 })

  const totalUsers = await User.countDocuments(filters.length ? { $and: filters } : {})

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Users fetched successfully',
    data: {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      page,
      limit,
    }
  })
}

export const updateUser = async (req, res, next) => {
  const { userId } = req.params

  const allowedUpdates = ['role', 'isActive']

  const updatedData = {}

  for (const field of allowedUpdates) {
    if (req.body.hasOwnProperty(field)) {
      updatedData[field] = req.body[field]
    }
  }

  const updateUser = await User.findOneAndUpdate({ _id: userId }, updatedData, { new: true, runValidators: true }).select('-password')

  if (!updateUser) throw new AppError(StatusCodes.NOT_FOUND, 'User not found')

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User updated successfully',
    data: updateUser
  })
}

export const getCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User fetched successfully',
    data: req.user
  })
}