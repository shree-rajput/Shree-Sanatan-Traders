import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import UserTable from "../../components/admin/users/UserTable";
import UserDetailsDrawer from "../../components/admin/users/UserDetailsDrawer";
import UserAnalytics from "../../components/admin/users/UserAnalytics";
import SearchBar from "../../components/admin/shared/SearchBar";
import Pagination from "../../components/admin/shared/Pagination";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users-v2", { params: { page, search, limit: 15 } });
      setUsers(res.data.users || []);
      setPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (user, data) => {
    await API.patch(`/admin/users-v2/${user._id}`, data);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black dark:text-white">Users</h1><p className="text-gray-500">Search, ban, promote and inspect customer activity.</p></div>
      <UserAnalytics users={users} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
      {loading ? <LoadingSkeleton rows={6} /> : <UserTable users={users} onSelect={setSelected} onToggleBan={(u) => updateUser(u, { isBanned: !u.isBanned })} onPromote={(u) => updateUser(u, { role: u.role === "admin" ? "user" : "admin" })} />}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <UserDetailsDrawer user={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AdminUsers;
