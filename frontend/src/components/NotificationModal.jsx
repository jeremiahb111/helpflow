import { Loader, MessageCircleMore, Ticket, UserPlus2, XIcon } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import useMarkAsReadNotif from "../hooks/useMarkAsReadNotif";

const setIcon = (type) => {
  switch (type) {
    case "assignedTicket":
      return <Ticket className="size-16 text-purple-600" />;
    case "comment":
      return <MessageCircleMore className="size-16 text-green-600" />;
    case "userCreated":
      return <UserPlus2 className="size-16 text-blue-600" />;
  }
};

const setMessage = (role, type, recipients) => {
  let messateText = ""

  if (type === "assignedTicket") {
    if (role === "agent" && recipients?.length > 1) {
      messateText = "Admin has assingned you to a new ticket."
    } else {
      messateText = "Your ticket has been assigned to the agent."
    }
  } else if (type === "comment") {
    messateText = "There is a new comment on your ticket."
  } else if (type === "userCreated" && role === "admin") {
    messateText = "A new user has been created. Please review the details."
  }

  return messateText
}

const isReadNotif = (isReadByUser, userId) => {
  const isRead = isReadByUser.some(item => {
    return item.user.toString() === userId && !item.read
  })

  return isRead
}

const NotificationModal = ({ setShowNotification, notifications }) => {
  const { authUser } = useAuth()
  const { markAsReadNotif, isPending } = useMarkAsReadNotif()

  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white max-h-[75%] rounded-lg shadow-lg w-full max-w-lg flex flex-col text-black">

        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-300 p-3 flex-shrink-0 rounded-t-lg">
          <h2 className="text-2xl font-bold text-center">Notifications</h2>
          <button className="absolute  top-1/4 right-4 bg-gray-400 text-gray-200 hover:bg-gray-500 p-1 rounded-full">
            <XIcon onClick={() => setShowNotification(false)} />
          </button>
        </div>

        {/* Scrollable Content: grows to fill and scrolls */}
        {notifications?.length === 0 ? (
          <>
            <div className="flex items-center justify-center p-5">
              <p>No notifications yet.</p>
            </div>
          </>
        ) :
          <div className="p-4 overflow-y-auto flex-grow space-y-2">
            {notifications?.map((notification) => (
              <div key={notification._id} className="card border border-gray-300 px-4 py-2 rounded-lg bg-white shadow-md gap-3 relative">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold capitalize">
                    {setIcon(notification.type)}
                  </h2>
                  <div className=" flex flex-col items-start gap-1">
                    <p className="text-sm text-gray-600">
                      {setMessage(authUser?.role, notification?.type, notification?.recipients)}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer inline" onClick={() => {
                      setShowNotification(false)
                      notification?.relatedUser ? navigate(`/users`) : navigate(`/tickets/${notification?.relatedTicket}`)
                    }}>
                      View
                    </span>
                  </div>
                </div>
                {isReadNotif(notification?.isReadByUser, authUser?._id) &&
                  <div className={`ml-auto absolute bottom-${isPending ? '0' : '1.5'} right-2`}>
                      <button className="text-blue-600 text-sm hover:underline" onClick={() => markAsReadNotif(notification._id)} disabled={isPending}>
                        {isPending ? (
                          <Loader className="animate-spin size-5 text-blue-600" />
                        ) : (
                          'Mark as Read'
                        )}
                      </button>
                  </div>
                }
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
export default NotificationModal