import { useEffect, useState } from 'react';
import useGetTickets from '../hooks/useGetTickets';
import PageLoader from '../components/PageLoader';
import CreateTicket from '../components/CreateTicket';
import TicketsTable from '../components/TicketsTable';
import useAuth from '../hooks/useAuth';
import { TicketIcon } from 'lucide-react';

const HomePage = () => {
  const [ticketIdFilter, setTicketIdFilter] = useState('')
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [filter, setFilter] = useState({
    status: '',
    ticketId: '',
    priority: '',
    page: 1,
    assignedTo: ''
  })

  const { tickets, isLoading, refetch } = useGetTickets(filter);
  const { authUser } = useAuth()

  const isAgent = authUser?.role === "agent"
  const isUser = authUser?.role === "user"

  useEffect(() => {
    if (ticketIdFilter === '') {
      setFilter({ ...filter, ticketId: '' })
    }
  }, [ticketIdFilter])

  const changePage = (page) => {
    if (page >= 1 && page <= tickets?.totalItems) setFilter({ ...filter, page: page })
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setFilter(prev => {
        return { ...prev, ticketId: ticketIdFilter }
      })
    }
  }

  const handleAssignedTicket = () => {
    setFilter(prev => {
      return { ...prev, assignedTo: filter.assignedTo ? '' : authUser?._id }
    })

    refetch()
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-4xl font-bold">Tickets</h1>

          {/* Filters and New Ticket Button */}
          <div className="flex items-center gap-4">
            {/* Ticket ID Filter Input */}
            <div className="flex items-center gap-2">
              <label className="mr-2">Ticket ID:</label>
              <input
                type="text"
                className="input input-bordered w-40"
                placeholder="Enter Ticket ID"
                value={ticketIdFilter}
                onChange={(e) => setTicketIdFilter(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="mr-2">Status:</label>
              <select
                className="select select-bordered w-40"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {isAgent ? (
              <>
                <button className="btn btn-primary" onClick={handleAssignedTicket}>
                  <TicketIcon size={20} />
                  View {filter.assignedTo ? 'All Tickets' : 'Assigned Tickets'}
                </button>
              </>
            ) : (
              <>
                {/* New Ticket Button */}
                {isUser && <button className="btn btn-primary" onClick={() => setShowTicketModal(true)}>
                  <TicketIcon size={20} />
                  New Ticket
                </button>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="flex-1 mt-4 min-h-0">
        <TicketsTable tickets={tickets} />
      </div>



      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {((filter.page - 1) * tickets?.limit) + 1}–{Math.min(filter.page * tickets?.limit, tickets?.totalItems)} of {tickets?.totalItems} Ticket{tickets?.totalItems !== 1 && 's'}
        </p>

        <div className="join">
          <button
            className="join-item btn"
            onClick={() => changePage(filter.page - 1)}
            disabled={filter.page === 1}
          >
            «
          </button>

          {filter.page > 2 && (
            <>
              <button className="join-item btn" onClick={() => changePage(1)}>1</button>
              {filter.page > 3 && <button className="join-item btn btn-disabled">...</button>}
            </>
          )}

          {Array.from({ length: tickets?.totalPages }, (_, i) => i + 1)
            .filter(page => page >= filter.page - 1 && page <= filter.page + 1)
            .map(page => (
              <button
                key={page}
                className={`join-item btn ${filter.page === page ? 'btn-active' : ''}`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}

          {filter.page < tickets?.totalPages - 1 && (
            <>
              {filter.page < tickets?.totalPages - 2 && <button className="join-item btn btn-disabled">...</button>}
              <button className="join-item btn" onClick={() => changePage(tickets?.totalPages)}>{tickets?.totalPages}</button>
            </>
          )}

          <button
            className="join-item btn"
            onClick={() => changePage(filter.page + 1)}
            disabled={filter.page === tickets?.totalPages || tickets?.totalPages === 0}
          >
            »
          </button>
        </div>
      </div>

      {/* Modal */}
      {showTicketModal && <CreateTicket showModal={setShowTicketModal} />}
    </div>
  );
};

export default HomePage;
