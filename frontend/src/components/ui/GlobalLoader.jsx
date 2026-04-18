import React from "react";

const GlobalLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-orange-50/50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-orange-500 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-xl">🌾</span>
        </div>
      </div>
      <h2 className="mt-4 text-orange-800 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Shree Sanatan...</h2>
    </div>
  );
};

export default GlobalLoader;
