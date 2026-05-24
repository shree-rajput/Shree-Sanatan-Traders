import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminMobileSidebar = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative h-full w-80 max-w-[85vw]">
        <AdminSidebar onNavigate={onClose} />
      </div>
    </div>
  );
};

export default AdminMobileSidebar;
