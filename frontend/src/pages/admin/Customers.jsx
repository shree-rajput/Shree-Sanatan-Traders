import React, { useEffect, useState } from "react";
import API from "../../services/api";

import {
  LuSearch as Search,
  LuHistory as History,
  LuWallet as Wallet
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/admin/users")
      .then(res => {
        const safeData = res.data.map(u => ({
          ...u,
          name: u.name || "Unknown", // ✅ prevent crash
          phone: u.phone || "",
          creditBalance: Math.floor(Math.random() * 5000),
          totalSpent: Math.floor(Math.random() * 20000)
        }));
        setCustomers(safeData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load customers"); // ✅ better UX
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-emerald-700">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Customer Management
            </h1>
            <p className="text-gray-500 font-medium">
              Track purchases and manage credit (Udhaar)
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or phone..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
              Total Customers
            </p>
            <p className="text-2xl font-black text-gray-900">
              {customers.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
              Total Credit Given
            </p>
            <p className="text-2xl font-black text-red-600">
              ₹{customers.reduce((sum, c) => sum + c.creditBalance, 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
              Active This Month
            </p>
            <p className="text-2xl font-black text-emerald-700">84%</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
              New Customers
            </p>
            <p className="text-2xl font-black text-blue-700">+12</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider">
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Total Purchases</th>
                <th className="px-8 py-4">Credit Balance</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-emerald-700 flex items-center justify-center font-black">
                        {c.name?.[0]}
                      </div>
                      <span className="font-bold text-gray-900">
                        {c.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 font-medium text-gray-600">
                    {c.phone || "No phone"}
                  </td>

                  <td className="px-8 py-5 font-black text-gray-900">
                    ₹{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="px-8 py-5">
                    <span className={`font-black ${c.creditBalance > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      ₹{c.creditBalance.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                        <History size={18} />
                      </button>
                      <button className="p-2 text-emerald-700 hover:bg-green-50 rounded-xl">
                        <Wallet size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-20 text-center text-gray-500 font-medium italic">
              No customers found.
            </div>
          )}
        </div>
      </div>

  );
};

export default AdminCustomers;