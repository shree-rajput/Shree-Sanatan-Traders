import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import DataTable from "../../components/admin/shared/DataTable";
import StatusBadge from "../../components/admin/shared/StatusBadge";

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const fetchTickets = () => API.get("/admin/support").then((res) => setTickets(res.data.tickets || [])).catch(() => toast.error("Failed to load tickets"));
  useEffect(() => { fetchTickets(); }, []);
  const update = async (ticket, status) => {
    await API.patch(`/admin/support/${ticket._id}`, { status });
    toast.success("Ticket updated");
    fetchTickets();
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black dark:text-white">Support</h1>
      <DataTable data={tickets} columns={[
        { key: "subject", header: "Subject", render: (t) => <div><p className="font-black">{t.subject}</p><p className="text-xs text-gray-500">{t.user?.name || "Customer"}</p></div> },
        { key: "message", header: "Message" },
        { key: "priority", header: "Priority", render: (t) => <StatusBadge value={t.priority === "urgent" ? "cancelled" : "pending"} /> },
        { key: "status", header: "Status", render: (t) => <StatusBadge value={t.status === "resolved" ? "delivered" : "pending"} /> },
        { key: "actions", header: "Actions", render: (t) => <select value={t.status} onChange={(e) => update(t, e.target.value)} className="rounded-xl border p-2 dark:border-gray-700 dark:bg-gray-800"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select> },
      ]} />
    </div>
  );
};
export default AdminSupport;
