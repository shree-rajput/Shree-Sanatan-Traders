import React from "react";

const ProfileCard = ({ children, className = "" }) => {
  return (
    <section className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </section>
  );
};

export default ProfileCard;
