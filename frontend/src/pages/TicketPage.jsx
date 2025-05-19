import { useParams, Link } from 'react-router';
import useGetTicket from '../hooks/useGetTicket';
import PageLoader from '../components/PageLoader';
import useAuth from '../hooks/useAuth';
import useUpdateTicket from '../hooks/useUpdateTicket';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import useCommentTicket from '../hooks/useCommentTicket';
import { format } from 'date-fns';
import useGetUsers from '../hooks/useGetUsers';

const statusBadge = {
  'open': 'badge-warning',
  'in progress': 'badge-secondary',
  'resolved': 'badge-info',
  'closed': 'badge-success',
};

const TicketPage = () => {
  const { id } = useParams();
  const ticketId = id

  const { authUser } = useAuth()
  const { ticket, isLoading } = useGetTicket(ticketId)
  const { ticketMutation } = useUpdateTicket(ticketId)
  const { commentMutation, isSuccess } = useCommentTicket(ticketId)
  const { users } = useGetUsers({ type: 'agent', status: true })

  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')
  const [assignedUser, setAssignedUser] = useState('')

  const commentsEndRef = useRef(null)

  const isAdmin = authUser?.role === "admin"
  const isAgent = authUser?.role === "agent"
  const isUser = authUser?.role === "user"
  const hasRights = ticket?.createdBy?._id === authUser?._id || ticket?.assignedTo?._id === authUser?._id

  const handleUpdate = () => {
    if ((isAgent || isUser) && ticket?.status === status) {
      return toast.error('Cannot update to the same status', { duration: 2000 })
    } else if (isAgent && ticket.assignedTo?._id == authUser?._id && status === 'closed') {
      return toast.error('Only the ticket creator can close the ticket', { duration: 2000 })
    }

    ticketMutation({ ticketId, ticketData: { status, assignedTo: assignedUser } })
  }

  const handleComment = () => {
    if (!comment) {
      toast.error('Comment is required', { duration: 2000 })
      return
    }

    commentMutation({ ticketId, comment: { content: comment } })
  }

  useEffect(() => {
    if (isSuccess) {
      setComment('')
    }
  }, [isSuccess])

  useEffect(() => {
    if (ticket) {
      setStatus(ticket?.status)
    }
  }, [ticket])

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
    }
  }, [ticket?.comments])

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className='flex flex-col'>
          <h1 className="text-3xl font-bold">Ticket #{ticket.ticketId}</h1>
          <small className='text-gray-500'>Created By: {ticket?.createdBy?.fullName}</small>
        </div>
        <Link to="/" className="btn btn-outline">← Back</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Ticket Info */}
        <div className="card bg-base-100 shadow-xl p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold">{ticket.title}</h2>
            {isUser && <button className="btn btn-outline btn-info btn-sm">Edit</button>}
          </div>

          {/* Status Badge below title line */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`capitalize badge ${statusBadge[ticket.status]}`}>{ticket.status}</span>
          </div>

          {/* Ticket Description */}
          <div className="mb-4 whitespace-pre-wrap text-gray-800">{ticket.description}</div>

          {/* Display image */}
          {ticket?.image && (
            <div className="mb-4">
              <img
                src={ticket?.image}
                alt="Ticket related"
                className="rounded-lg border border-base-300 w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Right: Status, Assign User, and Comments */}
        <div className="card bg-base-100 shadow-xl p-4 h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Combined Dropdowns */}
          {<div className="mb-6 space-y-4">
            {/* Status Dropdown */}
            {(hasRights) && <div>
              <label className="text-sm font-semibold block mb-1">🛠️ Status:</label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>}

            {/* Assign To Dropdown */}
            {!isAdmin ? (
              <div>
                {(ticket?.assignedTo || isAgent) && <label className="text-sm font-semibold block mb-1">👤 Assign to:</label>}
                {ticket?.assignedTo ? (
                  <p className='inline-block text-purple-600'>{ticket?.assignedTo?.fullName}</p>
                ) : (
                  isAgent && <p className='underline inline-block text-purple-600 hover:cursor-pointer' onClick={() => ticketMutation({ ticketId })}>Assign To Me</p>
                )}
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold block mb-1">👤 Assign to:</label>
                {!ticket?.assignedTo ? <select
                  className="select select-bordered w-full max-w-xs"
                  onChange={(e) => setAssignedUser(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {users?.users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user?.fullName}
                    </option>
                  ))}
                </select> :
                  <p className='inline-block text-purple-600'>{ticket?.assignedTo?.fullName}</p>
                }
              </div>
            )}

            {/* Single Update Button */}
            {(hasRights || (isAdmin && !ticket?.assignedTo)) && <button
              className="btn btn-primary mt-2"
              onClick={handleUpdate}
            >
              💾 Update Ticket
            </button>}
          </div>}

          {/* Comments Section */}
          <div className="mb-4">
            <div className="font-semibold text-lg mb-3 border-b pb-2">Comments</div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scroll-smooth" ref={commentsEndRef}>
              {ticket?.comments.map((comment) => (
                <div key={comment._id} className="bg-base-200 p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {comment?.author?.fullName?.split(' ')[0].charAt().toUpperCase()}{comment?.author?.fullName?.split(' ')[1].charAt().toUpperCase()}
                      </div>
                      <p className="font-semibold">{comment?.author?.fullName}</p>

                      <span className="badge badge-sm badge-accent capitalize">{comment?.author?.role}</span>

                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">{format(comment.createdAt, 'MMM dd yyyy, h:mm a')}</p>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                placeholder="Write a comment..."
                className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button className="btn btn-sm btn-primary" disabled={!hasRights} onClick={handleComment}>Post Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
