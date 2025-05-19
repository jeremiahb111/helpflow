import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'helpflow_db'
    })
    console.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}