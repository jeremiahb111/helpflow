import { BellIcon, HomeIcon, LogOutIcon, Settings, TicketIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import NotificationModal from "./NotificationModal";
import { useState } from "react";
import useGetNotif from "../hooks/useGetNotif";


const Sidebar = () => {
  const [showNotification, setShowNotification] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const { authUser } = useAuth()
  const { logoutMutation } = useLogout()
  const { notifications } = useGetNotif()

  const notificationCount = notifications?.filter((notification) => notification.isReadByUser.some((r) => r.user === authUser._id && !r.read)).length

  const isAdmin = authUser?.role === "admin"

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <div className="text-3xl mb-6 text-center font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">HelpFlow</div>

      <nav className="flex flex-col gap-4">
        <Link to={'/'} className={`btn btn-ghost justify-start w-full gap-3 normal-case ${currentPath === "/" || currentPath.includes("/tickets") ? "btn-active" : ""}`}>
          <HomeIcon className="size-5" />
          <span>Home</span>
        </Link>
        {isAdmin && (
          <Link to="/users" className={`btn btn-ghost justify-start w-full gap-3 normal-case ${currentPath === "/users" ? "btn-active" : ""}`}>
            <UserIcon size={20} />
            <span>Users</span>
          </Link>
        )}
        <button to="/notifications" className={`btn btn-ghost justify-start w-full gap-3 normal-case`} onClick={() => setShowNotification(true)}>
          <BellIcon size={20} />
          <div className="flex justify-between w-full">
            <span>Notifications</span>
            {notificationCount > 0 && <span className="badge badge-sm badge-primary">{notificationCount}</span>}
          </div>
        </button>
      </nav>

      <div className="mt-auto w-full pt-4 border-t border-gray-700 flex items-center justify-between" >
        <div className="flex gap-3 items-center justify-center">
          <img src={authUser?.avatar} alt={authUser?.fullName} className="w-10 h-10 rounded-full" />
          <div className="flex flex-col items-start">
            <span className="text-md font-semibold">{authUser?.fullName}</span>
            <small className="capitalize">{authUser?.role}</small>
          </div>
        </div>
        <button className="text-left hover:bg-gray-800 p-2 rounded" onClick={logoutMutation}>
          <LogOutIcon size={20} />
        </button>
      </div>

      {/* Notification Modal */}
      {showNotification && <NotificationModal setShowNotification={setShowNotification} notifications={notifications} />}
    </div>
  );
};

export default Sidebar;
