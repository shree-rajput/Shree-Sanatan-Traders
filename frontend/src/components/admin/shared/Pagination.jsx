import React from "react";

const Pagination = ({ page = 1, pages = 1, onPageChange }) => (
  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900">
    <button
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
      className="rounded-xl px-4 py-2 text-white hover:text-black hover:bg-gray-100 disabled:opacity-40 dark:text-white-300 dark:hover:bg-gray-800"
    >
      Previous
    </button>
    <span className="text-gray-500 dark:text-gray-400">
      Page {page} of {pages}
    </span>
    <button
      disabled={page >= pages}
      onClick={() => onPageChange(page + 1)}
      className="rounded-xl px-4 py-2 text-white  hover:text-black   hover:bg-gray-100 disabled:opacity-40 dark:text-white-300 dark:hover:bg-gray-800"
    >
      Next
    </button>
  </div>
);

export default Pagination;
