import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse flex flex-col">
      <div className="bg-gray-200 h-56 w-full"></div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
