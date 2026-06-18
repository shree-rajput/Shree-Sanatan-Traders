import React, { useState } from "react";
import { LuLock } from "react-icons/lu";
import API from "../../services/api";
import toast from "react-hot-toast";

const ProfileSecurity = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await API.put("/users/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Password updated");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-6">
      <div className="flex items-center gap-3 mb-5">
        <LuLock className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Security</h2>
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Current Password
        </label>

        <input
          type="password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              oldPassword: e.target.value,
            })
          }
          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          New Password
        </label>

        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              newPassword: e.target.value,
            })
          }
          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Confirm Password
        </label>

        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              confirmPassword: e.target.value,
            })
          }
          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ProfileSecurity;
