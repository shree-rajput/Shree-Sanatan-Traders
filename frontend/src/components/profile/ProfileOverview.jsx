import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LuCalendarDays, LuUpload, LuUserRound } from "react-icons/lu";
import ProfileInput, { ProfileTextarea, SectionHeader } from "./ProfileInput";
import { updateProfile, uploadAvatar } from "../../services/profileService";

const API_ORIGIN = "http://localhost:5000";

const imageUrl = (value) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `${API_ORIGIN}${value}`;
};

const ProfileOverview = ({ user, onProfileUpdate }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    website: user?.website || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "Not available";
    return new Date(user.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" });
  }, [user?.createdAt]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required";
    if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone)) return "Enter a valid phone number";
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website)) return "Website must start with http:// or https://";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    try {
      setSaving(true);
      const res = await updateProfile(form);
      onProfileUpdate(res.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadAvatar(file);
      onProfileUpdate(res.user);
      toast.success("Avatar uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Profile Overview"
        description="Keep your personal details accurate for orders, support, and marketplace trust."
        icon={LuUserRound}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-center">
          <div className="mx-auto h-28 w-28 overflow-hidden rounded-3xl bg-white text-green-700 shadow-sm">
            {user?.avatar ? (
              <img src={imageUrl(user.avatar)} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-black">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700">
            <LuUpload size={17} />
            {uploading ? "Uploading" : "Upload Avatar"}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
          </label>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
            <LuCalendarDays size={15} />
            Joined {joinedDate}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <ProfileInput label="Full Name" name="name" value={form.name} onChange={handleChange} required />
          <ProfileInput label="Email" name="email" value={form.email} disabled />
          <ProfileInput label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
          <ProfileInput label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" />
          <div className="md:col-span-2">
            <ProfileInput label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Primary business or contact address" />
          </div>
          <div className="md:col-span-2">
            <ProfileTextarea label="Bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell buyers and sellers about your work" />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileOverview;
