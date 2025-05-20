import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import { format } from "date-fns"
import useGetUsers from "../hooks/useGetUsers"
import PageLoader from "../components/PageLoader"
import UserProfile from "../components/UserProfile"

const UsersPage = () => {
  const [viewProfile, setViewProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilter] = useState({
    status: '',
    type: '',
    userIdentifier: '',
    page: 1
  })

  const { users, isLoading, refetch } = useGetUsers(filters)

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilter(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      setFilter(prev => {
        return { ...prev, userIdentifier: search }
      })
    }
  }

  const changePage = (page) => {
    if (page >= 1 && page <= users?.totalUsers) setFilter({ ...filters, page: page })
  };

  useEffect(() => {
    if (search === '') {
      setFilter(prev => {
        return { ...prev, userIdentifier: '' }
      })
    }
  }, [search])

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-4xl font-bold">Users</h1>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="mr-2">Status:</label>
              <select
                className="select select-bordered w-40"
                onChange={handleFilterChange}
                name="status"
                value={filters.status}
              >
                <option value="">All</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="mr-2">Type:</label>
              <select
                className="select select-bordered w-40"
                onChange={handleFilterChange}
                name="type"
                value={filters.type}
              >
                <option value="">All</option>
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="mr-2">Name/Email:</label>
              <input
                type="text"
                placeholder="Search name or email"
                className="input input-bordered max-w-3xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchEnter}
              />
              <button className="btn btn-primary" onClick={refetch}>
                <SearchIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-base-300 rounded-lg overflow-hidden h-full flex flex-col mt-6">
        <div className="overflow-y-auto flex-1">
          <table className="table w-full border-separate border-spacing-0 border-base-300">
            <thead className='bg-gray-300 sticky top-0 z-10'>
              <tr>
                <th className="border border-base-300 bg-gray-300">#</th>
                <th className="border border-base-300 bg-gray-300">Full Name</th>
                <th className="border border-base-300 bg-gray-300">Email</th>
                <th className="border border-base-300 bg-gray-300">Role</th>
                <th className="border border-base-300 bg-gray-300">Status</th>
                <th className="border border-base-300 bg-gray-300">Created Date</th>
                <th className="border border-base-300 bg-gray-300">Update Date</th>
                <th className="border border-base-300 bg-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.users.map((user, index) => (
                <tr key={user._id} className="hover:bg-base-300 cursor-pointer transition">
                  <td className="border border-base-300">{(filters?.page - 1) * users?.limit + index + 1}</td>
                  <td className="border border-base-300">{user.fullName}</td>
                  <td className="border border-base-300">{user.email}</td>
                  <td className="border border-base-300 capitalize">{user.role}</td>
                  <td className="border border-base-300">{user.isActive ? "Active" : "Inactive"}</td>
                  <td className="border border-base-300">{format(user.createdAt, 'MM/dd/yyyy')}</td>
                  <td className="border border-base-300">{format(user.updatedAt, 'MM/dd/yyyy')}</td>
                  <td className="border border-base-300">
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline btn-info hover:bg-info hover:text-white transition" onClick={() => {
                        setSelectedUser(user)
                        setViewProfile(true)
                      }}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {((filters.page - 1) * users?.limit) + 1}–{Math.min(filters.page * users?.limit, users?.totalUsers)} of {users?.totalUsers} User{users?.totalUsers !== 1 && 's'}
        </p>

        <div className="join">
          <button
            className="join-item btn"
            onClick={() => changePage(filters.page - 1)}
            disabled={filters.page === 1}
          >
            «
          </button>

          {filters.page > 2 && (
            <>
              <button className="join-item btn" onClick={() => changePage(1)}>1</button>
              {filters.page > 3 && <button className="join-item btn btn-disabled">...</button>}
            </>
          )}

          {Array.from({ length: users?.totalPages }, (_, i) => i + 1)
            .filter(page => page >= filters.page - 1 && page <= filters.page + 1)
            .map(page => (
              <button
                key={page}
                className={`join-item btn ${filters.page === page ? 'btn-active' : ''}`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}

          {filters.page < users?.totalPages - 1 && (
            <>
              {filters.page < users?.totalPages - 2 && <button className="join-item btn btn-disabled">...</button>}
              <button className="join-item btn" onClick={() => changePage(users?.totalPages)}>{users?.totalPages}</button>
            </>
          )}

          <button
            className="join-item btn"
            onClick={() => changePage(filters.page + 1)}
            disabled={filters.page === users?.totalPages || users?.totalPages === 0}
          >
            »
          </button>
        </div>
      </div>

      {/* Modal */}
      {viewProfile && <UserProfile user={selectedUser} setViewProfile={setViewProfile} filters={filters} />}
    </div>
  )
}
export default UsersPage