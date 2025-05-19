import { axiosInstance } from '../lib/axios'

export const signup = async (signupData) => {
  const res = await axiosInstance.post('/auth/signup', signupData)

  return res.data
}

export const login = async (loginData) => {
  const res = await axiosInstance.post('/auth/login', loginData)

  return res.data
}

export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout')

  return res.data
}

export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get('/users/me')

    return res.data
  } catch (error) {
    console.log(error.response?.data?.message)
    return null
  }
}

export const getTickets = async (filter) => {
  const res = await axiosInstance.get('/tickets', {
    params: filter
  })

  return res.data
}

export const createTicket = async (ticketData) => {
  const res = await axiosInstance.post('/tickets', ticketData)

  return res.data
}

export const getTicket = async (ticketId) => {
  const res = await axiosInstance.get(`/tickets/${ticketId}`)

  return res.data
}

export const updateTicket = async ({ ticketId, ticketData }) => {
  const res = await axiosInstance.put(`/tickets/${ticketId}`, ticketData)

  return res.data
}

export const comment = async ({ ticketId, comment }) => {
  const res = await axiosInstance.post(`/tickets/${ticketId}/comments`, { comment })

  return res.data
}

export const getAllUsers = async (filters) => {
  const res = await axiosInstance.get('/users', {
    params: filters
  })

  return res.data
}

export const updateUserProfile = async ({ userInfo }) => {
  const res = await axiosInstance.put(`/users/${userInfo._id}/update`, userInfo)

  return res.data
}

export const getNotifications = async () => {
  const res = await axiosInstance.get('/notifications')

  return res.data
}

export const markAsReadNotification = async (notificationId) => {
  const res = await axiosInstance.put(`/notifications/${notificationId}/mark-as-read`)

  return res.data
}