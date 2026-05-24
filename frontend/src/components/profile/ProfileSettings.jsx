import React, { useState } from "react";
import { LuBell, LuLock, LuShieldCheck, LuEye, LuEyeOff } from "react-icons/lu";

import API from "../../services/api";
import toast from "react-hot-toast";

const ProfileSettings = ({ user, refreshProfile }) => {
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    lowStock: user?.notificationSettings?.lowStock ?? true,
    newOrders: user?.notificationSettings?.newOrders ?? true,
    weeklyReport: user?.notificationSettings?.weeklyReport ?? false,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleNotificationUpdate = async () => {
    try {
      setSaving(true);

      await API.put("/users/me", {
        notificationSettings: notifications,
      });

      toast.success("Notification settings updated");

      if (refreshProfile) {
        refreshProfile();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update notification settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      if (passwordData.newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      setSaving(true);

      await API.put("/users/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <LuBell size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>

            <p className="text-sm text-gray-500">
              Manage email and order alerts
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Low Stock Alerts</h4>

              <p className="text-sm text-gray-500">
                Get notified for low inventory
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications.lowStock}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  lowStock: e.target.checked,
                })
              }
              className="w-5 h-5 accent-green-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">New Order Alerts</h4>

              <p className="text-sm text-gray-500">
                Receive updates for new orders
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications.newOrders}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  newOrders: e.target.checked,
                })
              }
              className="w-5 h-5 accent-green-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Weekly Reports</h4>

              <p className="text-sm text-gray-500">
                Receive weekly sales and activity reports
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  weeklyReport: e.target.checked,
                })
              }
              className="w-5 h-5 accent-green-600"
            />
          </div>
        </div>

        <button
          onClick={handleNotificationUpdate}
          disabled={saving}
          className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition"
        >
          Save Notification Settings
        </button>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <LuShieldCheck size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Security</h2>

            <p className="text-sm text-gray-500">
              Update your password securely
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {/* OLD PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                required
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 outline-none pr-14"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500"
              >
                {showOld ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 outline-none pr-14"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500"
              >
                {showNew ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
