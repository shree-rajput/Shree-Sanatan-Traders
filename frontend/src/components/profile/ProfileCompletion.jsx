import React from "react";

const ProfileCompletion = ({ percentage = 0, missingSteps = [] }) => {
  const safePercentage = Math.min(100, Math.max(0, Number(percentage) || 0));

  return (
    <div className="rounded-3xl border border-green-100 bg-green-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-gray-900">Profile completion</p>
        <span className="text-sm font-black text-green-700">{safePercentage}%</span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      {missingSteps.length > 0 && (
        <div className="mt-4 space-y-2">
          {missingSteps.slice(0, 3).map((step) => (
            <p key={step} className="text-xs font-medium text-gray-600">
              {step}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
