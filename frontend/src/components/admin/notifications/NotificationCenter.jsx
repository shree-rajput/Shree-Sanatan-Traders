import React from "react";
import NotificationCard from "./NotificationCard";

const NotificationCenter = ({ notifications = [], onRead }) => (
  <div className="grid gap-4">
    {notifications.map((notification) => <NotificationCard key={notification._id} notification={notification} onRead={onRead} />)}
  </div>
);

export default NotificationCenter;
