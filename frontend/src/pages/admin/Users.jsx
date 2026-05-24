import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  LuUsers, 
  LuSearch, 
  LuMail, 
  LuPhone, 
  LuShield,
  LuLoaderCircle
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage registered customers and staff.</p>
        </div>
        <div className="relative w-full md:w-96">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 font-medium dark:text-white outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <LuLoaderCircle className="animate-spin text-green-600 mb-4" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Loading Users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-10 py-5">User Information</th>
                  <th className="px-10 py-5">Contact Details</th>
                  <th className="px-10 py-5">Role</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-sm border border-gray-200 dark:border-gray-700 shadow-sm">
                          {user.name ? user.name[0] : "U"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <LuMail size={14} className="text-gray-400 dark:text-gray-500" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <LuPhone size={14} className="text-gray-400 dark:text-gray-500" /> {user.phone || "No phone"}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                        }`}>
                         {user.role === 'admin' && <LuShield size={12} />}
                         {user.role || 'user'}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest">
                          View History
                       </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-sm">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
