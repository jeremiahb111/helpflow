import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'

config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImage = async (file) => {
  const res = await cloudinary.uploader.upload(file, {
    folder: 'helpflow/description'
  })

  return res.secure_url
}

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, {
    folder: 'helpflow'
  })
}