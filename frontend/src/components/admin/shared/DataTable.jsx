import React from "react";

const DataTable = ({ columns = [], data = [], keyField = "_id" }) => (
  <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-gray-50 text-xs font-black uppercase tracking-wide text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map((row, index) => (
            <tr key={row[keyField] || index} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
