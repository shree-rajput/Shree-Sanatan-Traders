import React from "react";

const LoadingSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-20 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800" />
    ))}
  </div>
);

export default LoadingSkeleton;
