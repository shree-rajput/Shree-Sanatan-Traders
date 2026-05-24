import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LuLock, LuShieldCheck, LuTriangleAlert } from "react-icons/lu";
import ProfileInput, { SectionHeader } from "./ProfileInput";
import { changePassword, deleteAccount, logoutAllDevices } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

const ProfileSecurity = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    if (form.newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");

    try {
      setSaving(true);
      await changePassword(form);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      toast.success("Security request completed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to logout devices");
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) return toast.error("Password is required");
    try {
      setSaving(true);
      await deleteAccount(deletePassword);
      toast.success("Account deleted");
      logout();
      navigate("/register");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Security" description="Manage passwords and sensitive account actions." icon={LuShieldCheck} />

      <form onSubmit={handlePassword} className="grid gap-5 md:grid-cols-3">
        <ProfileInput label="Current Password" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        <ProfileInput label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
        <ProfileInput label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-70"
          >
            <LuLock size={17} />
            {saving ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <h3 className="font-black text-gray-900">Logout all devices</h3>
          <p className="mt-2 text-sm text-gray-500">End other active sessions connected to this account.</p>
          <button onClick={handleLogoutAll} className="mt-5 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-700 transition hover:border-green-300 hover:text-green-700">
            Logout All Devices
          </button>
        </div>
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
          <h3 className="flex items-center gap-2 font-black text-red-700">
            <LuTriangleAlert size={18} />
            Delete account
          </h3>
          <p className="mt-2 text-sm text-red-600">This permanently removes your account profile.</p>
          <button onClick={() => setShowDelete(true)} className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900">Confirm account deletion</h3>
            <p className="mt-2 text-sm text-gray-500">Enter your password to confirm this action.</p>
            <div className="mt-5">
              <ProfileInput label="Password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => setShowDelete(false)} className="rounded-2xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-700">Cancel</button>
              <button onClick={handleDelete} disabled={saving} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white disabled:opacity-70">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSecurity;
