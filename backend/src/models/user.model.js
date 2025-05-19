import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'agent', 'user'],
      message: '{VALUE} is not supported'
    },
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const hashedPassword = await bcrypt.hash(this.password, 12)
  this.password = hashedPassword
  next()
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = model('User', userSchema)

export default User