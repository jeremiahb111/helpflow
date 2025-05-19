import { MessageCircleMore, TicketIcon, UserPlus2 } from "lucide-react";

const sampleNotifications = [
  {
    _id: "1a",
    recipients: ["user123", "user456"],
    relatedUser: "user789",
    relatedTicket: "ticket001",
    type: "assignedTicket",
    isReadByUser: [
      { user: "user123", read: false },
      { user: "user456", read: true }
    ],
    message: "You have been assigned a new ticket.",
    createdAt: new Date()
  },
  {
    _id: "2a",
    recipients: ["user111"],
    relatedUser: "user222",
    relatedTicket: "ticket002",
    type: "commentedTicket",
    isReadByUser: [{ user: "user111", read: false }],
    message: "There is a new comment on your ticket.",
    createdAt: new Date()
  },
  {
    _id: "3a",
    recipients: ["user123", "user333"],
    relatedUser: "user999",
    relatedTicket: "ticket003",
    type: "resolvedTicket",
    isReadByUser: [
      { user: "user123", read: true },
      { user: "user333", read: false }
    ],
    message: "A ticket you were involved in has been resolved.",
    createdAt: new Date()
  },
  {
    _id: "3a",
    recipients: ["user123", "user333"],
    relatedUser: "user999",
    relatedTicket: "ticket003",
    type: "resolvedTicket",
    isReadByUser: [
      { user: "user123", read: true },
      { user: "user333", read: false }
    ],
    message: "A ticket you were involved in has been resolved.",
    createdAt: new Date()
  },
  {
    _id: "3a",
    recipients: ["user123", "user333"],
    relatedUser: "user999",
    relatedTicket: "ticket003",
    type: "resolvedTicket",
    isReadByUser: [
      { user: "user123", read: true },
      { user: "user333", read: false }
    ],
    message: "A ticket you were involved in has been resolved.",
    createdAt: new Date()
  },
  {
    _id: "3a",
    recipients: ["user123", "user333"],
    relatedUser: "user999",
    relatedTicket: "ticket003",
    type: "resolvedTicket",
    isReadByUser: [
      { user: "user123", read: true },
      { user: "user333", read: false }
    ],
    message: "A ticket you were involved in has been resolved.",
    createdAt: new Date()
  },
  {
    _id: "3a",
    recipients: ["user123", "user333"],
    relatedUser: "user999",
    relatedTicket: "ticket003",
    type: "resolvedTicket",
    isReadByUser: [
      { user: "user123", read: true },
      { user: "user333", read: false }
    ],
    message: "A ticket you were involved in has been resolved.",
    createdAt: new Date()
  }
];

const setIcon = (type) => {
  switch (type) {
    case "assignedTicket":
      return <TicketIcon className="size-5 text-blue-600" />;
    case "commentedTicket":
      return <MessageCircleMore className="size-5 text-green-600" />;
    case "userCreated":
    default:
      return <UserPlus2 className="size-5 text-purple-600" />;
  }
};

const NotificationPage = () => {
  return (
    <div className="p-6 flex flex-col gap-12 overflow-hidden">
      <h1 className="text-4xl font-bold">Notifications</h1>
      <div className="flex justify-center  max-h-[calc(100vh-10rem)]  border border-red-500">
        <div className="w-full max-w-5xl space-y-4 overflow-y-auto px2">
          {sampleNotifications.map((notification) => (
            <div
              key={notification._id}
              className="card border border-gray-300 p-4 rounded-lg bg-white shadow-xl transition-transform duration-200 hover:scale-[1.02] flex gap-3 items-center"
            >
              {setIcon(notification.type)}
              <div className="flex flex-col">
                <h2 className="font-semibold capitalize">{notification.type.replace(/([A-Z])/g, ' $1')}</h2>
                <p className="text-sm text-gray-600">{notification.message || 'You have a new notification.'}</p>
                <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
              <div className="ml-auto">
                <button className="text-blue-600 text-sm hover:underline">Mark as Read</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default NotificationPage;
