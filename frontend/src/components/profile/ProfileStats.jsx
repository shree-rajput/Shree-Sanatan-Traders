import React from "react";
import { LuIndianRupee, LuMapPin, LuPackage, LuShieldCheck } from "react-icons/lu";

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-1 truncate text-xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ProfileStats = ({ orders = [], addressesCount = 0, completion = 0 }) => {
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={LuPackage} label="Orders" value={orders.length} />
      <Stat icon={LuIndianRupee} label="Total spent" value={`INR ${totalSpent.toLocaleString("en-IN")}`} />
      <Stat icon={LuMapPin} label="Addresses" value={addressesCount} />
      <Stat icon={LuShieldCheck} label="Completed" value={`${completion}%`} />
    </div>
  );
};

export default ProfileStats;
