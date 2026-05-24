import React from "react";
import { LuLeaf } from "react-icons/lu";

const ProfileHeader = ({ user }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          <LuLeaf size={14} />
          Account center
        </div>
        <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
          Manage your marketplace identity, business details, orders, and account preferences.
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
        <span className="font-semibold text-gray-500">Signed in as </span>
        <span className="font-black text-gray-900">{user?.email}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
