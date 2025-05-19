import { format } from "date-fns"
import { XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import useUpdateUserProfile from "../hooks/useUpdateUserProfile"

const UserProfile = ({ user, setViewProfile, filters }) => {
  const [userProfile, setUserProfile] = useState(user)

  const { updateUserProfileMutation, isPending, isSuccess } = useUpdateUserProfile(filters)

  const handleChange = (e) => {
    const { name, value } = e.target
    const parseValue = value === 'true' ? true : value === 'false' ? false : value
    setUserProfile((prev) => ({ ...prev, [name]: parseValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (user.isActive === userProfile.isActive && user.role === userProfile.role) {
      return toast.error('No changes made', { duration: 2000 })
    }
    updateUserProfileMutation({ userInfo: userProfile })
  }

  useEffect(() => {
    if (isSuccess) setViewProfile(false)
  }, [isSuccess])

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg  overflow-y-auto">
        <div className="p-5">
          <div className="relative text-center border-b border-gray-300 mb-4">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <button className="absolute -top-1 right-0 text-gray-200 bg-gray-500 hover:bg-gray-600 p-1 rounded-full" onClick={() => setViewProfile(false)}>
              <XIcon size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="label text-neutral">Full Name:</label>
              <input
                type="text"
                value={userProfile.fullName}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                readOnly
                disabled
              />

              <label className="label text-neutral">Email:</label>
              <input
                type="text"
                value={userProfile.email}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                readOnly
                disabled
              />

              <label className="label text-neutral flex gap-0 items-center">
                <span className="text-red-500">*</span><span>Role:</span>
              </label>
              <select
                name="role"
                value={userProfile.role}
                className="select select-bordered w-full capitalize"
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>

              <label className="label text-neutral flex gap-0 items-center">
                <span className="text-red-500">*</span><span>Status:</span>
              </label>
              <select
                name="isActive"
                value={userProfile.isActive.toString()}
                className="select select-bordered w-full capitalize"
                onChange={handleChange}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

              <label className="label text-neutral">Created Date:</label>
              <input
                type="text"
                value={format(userProfile.createdAt, 'MMM dd, yyyy')}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 capitalize"
                readOnly
                disabled
              />

              <div>
                <button className="px-4 mt-3 py-2 w-full bg-green-500 text-white rounded hover:bg-green-600" type="submit">
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-xs"></span>
                      Upadating User...
                    </div>
                  ) : (
                    'Upate User'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default UserProfile