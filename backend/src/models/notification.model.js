import { Schema, model } from 'mongoose'

const notificationSchema = new Schema({
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  relatedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedTicket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  type: {
    type: String,
    enum: ['userCreated', 'assignedTicket', 'statusUpdate', 'comment'],
    required: true
  },
  isReadByUser: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
}, { timestamps: true })

const Notification = model('Notification', notificationSchema)

export default Notification