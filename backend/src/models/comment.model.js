import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true })

const Comment = model('Comment', commentSchema)

export default Comment