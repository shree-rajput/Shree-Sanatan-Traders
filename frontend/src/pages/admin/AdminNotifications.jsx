import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import NotificationCenter from "../../components/admin/notifications/NotificationCenter";
import SendNotificationModal from "../../components/admin/notifications/SendNotificationModal";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";
import Pagination from "../../components/admin/shared/Pagination";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/notifications", { params: { page, limit: 15 } });
      setNotifications(res.data.notifications || []);
      setPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (notification) => {
    await API.patch(`/admin/notifications/${notification._id}/read`);
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-3xl font-black dark:text-white">Notifications</h1><p className="text-gray-500">Stock, order, payment, delivery and announcement center.</p></div>
        <button onClick={() => setOpen(true)} className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white">Send Notification</button>
      </div>
      {loading ? <LoadingSkeleton rows={6} /> : <NotificationCenter notifications={notifications} onRead={markRead} />}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <SendNotificationModal open={open} onClose={() => setOpen(false)} onSent={fetchNotifications} />
    </div>
  );
};

export default AdminNotifications;
