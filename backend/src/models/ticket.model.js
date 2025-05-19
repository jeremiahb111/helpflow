import { Schema, model } from 'mongoose'

const ticketSchema = new Schema({
  ticketId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { timestamps: true })

const Ticket = model('Ticket', ticketSchema)

export default Ticket