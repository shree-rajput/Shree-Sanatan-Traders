import React from "react";
import {
  LuBell,
  LuLogOut,
  LuMapPin,
  LuPackage,
  LuSettings,
  LuShieldCheck,
  LuSprout,
  LuStore,
  LuUser,
} from "react-icons/lu";
import ProfileCompletion from "./ProfileCompletion";

const API_ORIGIN = "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};

const tabs = [
  { id: "overview", name: "Overview", icon: LuUser },
  { id: "business", name: "Business", icon: LuStore },
  { id: "addresses", name: "Addresses", icon: LuMapPin },
  { id: "orders", name: "Orders", icon: LuPackage },
  { id: "notifications", name: "Notifications", icon: LuBell },
  { id: "security", name: "Security", icon: LuShieldCheck },
  { id: "settings", name: "Settings", icon: LuSettings },
];

const ProfileSidebar = ({ user, activeTab, onTabChange, onLogout }) => {
  const avatarUrl = getImageUrl(user?.avatar);
  const RoleIcon = user?.userType === "farmer" ? LuSprout : LuStore;

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-3xl bg-green-100 text-green-700 shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.name || "Profile"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-black">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <h2 className="truncate text-xl font-black text-gray-900">{user?.name || "Marketplace User"}</h2>
        <p className="mt-1 truncate text-sm text-gray-500">{user?.email}</p>
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-700">
          <RoleIcon size={14} />
          {user?.userType || user?.role || "user"}
        </div>
        <div className="mt-5">
          <ProfileCompletion percentage={user?.profileCompletion} missingSteps={user?.missingSteps || []} />
        </div>
      </div>

      <nav className="rounded-3xl border border-gray-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
        >
          <LuLogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
