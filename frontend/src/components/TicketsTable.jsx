import { format } from 'date-fns';
import { Link } from 'react-router';

const statusBadge = {
  'open': 'badge-warning',
  'in progress': 'badge-secondary',
  'resolved': 'badge-info',
  'closed': 'badge-success',
};

const priorityBadge = {
  'low': 'badge-info',
  'medium': 'badge-warning',
  'high': 'badge-error',
};

const TicketsTable = ({ tickets }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full border border-base-300 mt-6">
        <thead className='bg-gray-300'>
          <tr>
            <th className="border border-base-300">ID</th>
            <th className="border border-base-300">Title</th>
            <th className="border border-base-300">Status</th>
            <th className="border border-base-300">Priority</th>
            <th className="border border-base-300">Reporter</th>
            <th className="border border-base-300">Assigned To</th>
            <th className="border border-base-300">Created</th>
            <th className="border border-base-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets?.tickets?.map(ticket => (
            <tr key={ticket._id} className="hover:bg-base-300 cursor-pointer transition">
              <td className="border border-base-300">{ticket.ticketId}</td>
              <td className="border border-base-300">{ticket.title}</td>
              <td className="border border-base-300">
                <span className={`badge ${statusBadge[ticket.status]}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="border border-base-300">
                <span className={`badge ${priorityBadge[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              </td>
              <td className="border border-base-300">{ticket.createdBy.fullName}</td>
              <td className="border border-base-300">{ticket?.assignedTo?.fullName}</td>
              <td className="border border-base-300">{format(ticket.createdAt, 'MM/dd/yyyy')}</td>
              <td className="border border-base-300">
                <div className="flex gap-2">
                  <Link to={`/tickets/${ticket._id}`} className="btn btn-sm btn-outline btn-info hover:bg-info hover:text-white transition">
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default TicketsTable