import React from "react";
import ThemeToggle from "../../components/admin/shared/ThemeToggle";
const AdminSettings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-black dark:text-white">Settings</h1>
    <div className="grid gap-4 md:grid-cols-2">
      {["Store settings", "Currency", "Tax settings", "Shipping settings", "Payment settings", "Email settings", "Notification settings"].map((item) => <div key={item} className="rounded-3xl bg-white p-6 dark:bg-gray-900"><h3 className="font-black dark:text-white">{item}</h3><p className="mt-2 text-sm text-gray-500">Configure {item.toLowerCase()} for the marketplace.</p></div>)}
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900"><h3 className="font-black dark:text-white">Theme settings</h3><div className="mt-4"><ThemeToggle /></div></div>
    </div>
  </div>
);
export default AdminSettings;
