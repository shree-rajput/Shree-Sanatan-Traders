import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuImagePlus, LuSprout, LuStore } from "react-icons/lu";
import ProfileInput, { ProfileTextarea, SectionHeader } from "./ProfileInput";
import { updateProfile, uploadBanner } from "../../services/profileService";

const API_ORIGIN = "http://localhost:5000";

const imageUrl = (value) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `${API_ORIGIN}${value}`;
};

const ProfileBusiness = ({ user, onProfileUpdate }) => {
  const [form, setForm] = useState({
    userType: user?.userType || "farmer",
    landSize: user?.landSize || "",
    crops: Array.isArray(user?.crops) ? user.crops.join(", ") : user?.crops || "",
    irrigation: user?.irrigation || "",
    farmingType: user?.farmingType || "",
    soilType: user?.soilType || "",
    shopName: user?.shopName || "",
    gstNumber: user?.gstNumber || "",
    businessType: user?.businessType || "",
    website: user?.website || "",
    businessAddress: user?.businessAddress || user?.address || "",
    businessDescription: user?.businessDescription || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const res = await updateProfile({
        ...form,
        crops: form.crops.split(",").map((crop) => crop.trim()).filter(Boolean),
      });
      onProfileUpdate(res.user);
      toast.success("Business profile saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save business profile");
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadBanner(file);
      onProfileUpdate(res.user);
      toast.success("Business banner uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload banner");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Business Profile"
        description="Show the right agriculture or trade details to marketplace customers."
        icon={form.userType === "farmer" ? LuSprout : LuStore}
      />

      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
        {user?.businessBanner ? (
          <img src={imageUrl(user.businessBanner)} alt="Business banner" className="h-44 w-full object-cover sm:h-56" />
        ) : (
          <div className="flex h-44 items-center justify-center bg-green-50 text-green-700 sm:h-56">
            <LuImagePlus size={42} />
          </div>
        )}
        <label className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-gray-900 shadow-lg transition hover:text-green-700">
          <LuImagePlus size={17} />
          {uploading ? "Uploading" : "Upload Banner"}
          <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-3 block text-sm font-semibold text-gray-700">Account Type</label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {["farmer", "retailer", "wholesaler", "other"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((current) => ({ ...current, userType: type }))}
                className={`rounded-2xl border px-4 py-3.5 text-sm font-black capitalize transition ${
                  form.userType === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {form.userType === "farmer" ? (
          <>
            <ProfileInput label="Land Size" name="landSize" value={form.landSize} onChange={handleChange} placeholder="Example: 12 acres" />
            <ProfileInput label="Irrigation" name="irrigation" value={form.irrigation} onChange={handleChange} placeholder="Drip, canal, borewell" />
            <ProfileInput label="Farming Type" name="farmingType" value={form.farmingType} onChange={handleChange} placeholder="Organic, conventional, mixed" />
            <ProfileInput label="Soil Type" name="soilType" value={form.soilType} onChange={handleChange} placeholder="Black, alluvial, sandy" />
            <div className="md:col-span-2">
              <ProfileInput label="Crops" name="crops" value={form.crops} onChange={handleChange} placeholder="Wheat, paddy, mustard" />
            </div>
          </>
        ) : (
          <>
            <ProfileInput label="Shop Name" name="shopName" value={form.shopName} onChange={handleChange} />
            <ProfileInput label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} />
            <ProfileInput label="Business Type" name="businessType" value={form.businessType} onChange={handleChange} placeholder="Retail, wholesale, equipment supplier" />
            <ProfileInput label="Website" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" />
            <div className="md:col-span-2">
              <ProfileInput label="Business Address" name="businessAddress" value={form.businessAddress} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <ProfileTextarea label="Business Description" name="businessDescription" value={form.businessDescription} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Business Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileBusiness;
