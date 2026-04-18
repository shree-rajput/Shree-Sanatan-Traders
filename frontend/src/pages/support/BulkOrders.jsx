import React from "react";
import { Link } from "react-router-dom";

const BulkOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Wholesale & Bulk Orders</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Looking to outfit an entire farm, restock your spiritual supply chain, or secure heavy discounts on bulk deliveries? Our B2B platform provides dedicated account managers and massive volume reductions directly sourced from authentic providers.
          </p>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 mb-10 text-left">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">Bulk Order Benefits:</h3>
            <ul className="list-none space-y-3">
              <li className="flex items-center text-emerald-900 font-medium">
                <span className="text-green-600 mr-3">✔️</span> Tiered Pricing Discounts (Up to 40% Off)
              </li>
              <li className="flex items-center text-emerald-900 font-medium">
                <span className="text-green-600 mr-3">✔️</span> Priority Freight Shipping logistics
              </li>
              <li className="flex items-center text-emerald-900 font-medium">
                <span className="text-green-600 mr-3">✔️</span> Custom Sourcing for rare or specific traditional goods
              </li>
              <li className="flex items-center text-emerald-900 font-medium">
                <span className="text-green-600 mr-3">✔️</span> Dedicated 24/7 B2B Account Manager
              </li>
            </ul>
          </div>

          <Link to="/contact" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Request a Bulk Quote Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BulkOrders;
