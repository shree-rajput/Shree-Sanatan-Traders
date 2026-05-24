import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuBell } from "react-icons/lu";
import { ToggleSwitch, SectionHeader } from "./ProfileInput";
import { updateNotifications } from "../../services/profileService";

const options = [
  ["lowStock", "Low Stock", "Get alerts when inventory or farm supplies need attention."],
  ["newOrders", "New Orders", "Receive notifications when fresh orders arrive."],
  ["weeklyReport", "Weekly Report", "Get a weekly account and order summary."],
  ["promotions", "Promotions", "Receive marketplace offers and seasonal campaigns."],
  ["smsAlerts", "SMS Alerts", "Send important alerts to your phone."],
  ["emailAlerts", "Email Alerts", "Send important alerts to your email inbox."],
];

const ProfileNotifications = ({ user, onProfileUpdate }) => {
  const [settings, setSettings] = useState({
    lowStock: user?.notificationSettings?.lowStock ?? true,
    newOrders: user?.notificationSettings?.newOrders ?? true,
    weeklyReport: user?.notificationSettings?.weeklyReport ?? false,
    promotions: user?.notificationSettings?.promotions ?? false,
    smsAlerts: user?.notificationSettings?.smsAlerts ?? false,
    emailAlerts: user?.notificationSettings?.emailAlerts ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async (nextSettings) => {
    try {
      setSaving(true);
      const res = await updateNotifications(nextSettings);
      onProfileUpdate(res.user);
      toast.success("Notification settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update notifications");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key, value) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    save(nextSettings);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Notifications" description="Choose how the marketplace keeps you updated." icon={LuBell} />
      <div className="grid gap-4 md:grid-cols-2">
        {options.map(([key, label, description]) => (
          <ToggleSwitch
            key={key}
            checked={settings[key]}
            onChange={(value) => handleToggle(key, value)}
            label={label}
            description={description}
          />
        ))}
      </div>
      {saving && <p className="text-sm font-semibold text-green-700">Saving changes...</p>}
    </div>
  );
};

export default ProfileNotifications;
