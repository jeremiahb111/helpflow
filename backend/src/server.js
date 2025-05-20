import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import consoleStamp from 'console-stamp'
import path from 'path'

import { errorHandler } from './utils/errorHandler.js'
import { connectDB } from './lib/mongodb.js'

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import ticketRoutes from './routes/ticket.route.js'
import notificationRoutes from './routes/notification.route.js'

config()
consoleStamp(console, {
  format: ':date(mm/dd/yyyy - HH:MM:ss.l) :label'
})
const app = express()
const port = process.env.PORT
const __dirname = path.resolve()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/tickets', ticketRoutes)
app.use('/api/v1/notifications', notificationRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  })
}

app.use(errorHandler)

app.listen(port, async () => {
  console.info(`Server running on port ${port}`)
  await connectDB()
})