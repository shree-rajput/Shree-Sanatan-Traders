import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuSettings } from "react-icons/lu";
import ProfileInput, { SectionHeader, ToggleSwitch } from "./ProfileInput";
import { updateSettings } from "../../services/profileService";

const ProfileSettings = ({ user, onProfileUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    language: user?.language || "English",
    currency: user?.currency || "INR",
    theme: "light",
    accountVisibility: user?.accountVisibility || "private",
    emailPreferences: {
      orderUpdates: user?.emailPreferences?.orderUpdates ?? true,
      offers: user?.emailPreferences?.offers ?? false,
      newsletter: user?.emailPreferences?.newsletter ?? false,
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const res = await updateSettings(form);
      onProfileUpdate(res.user);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Adjust account defaults for the marketplace experience."
        icon={LuSettings}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <ProfileInput
          label="Language"
          name="language"
          value={form.language}
          onChange={handleChange}
        />
        <ProfileInput label="Theme" name="theme" value="Light" disabled />
        <div className="space-y-2"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["orderUpdates", "Order updates", "Email me about order progress."],
          ["offers", "Offers", "Email me marketplace offers."],
          ["newsletter", "Newsletter", "Email me weekly marketplace news."],
        ].map(([key, label, description]) => (
          <ToggleSwitch
            key={key}
            checked={form.emailPreferences[key]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                emailPreferences: { ...current.emailPreferences, [key]: value },
              }))
            }
            label={label}
            description={description}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
};

export default ProfileSettings;
