import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { translations } from "../utils/translations";

const Products = ({ lang = "en" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[lang] || translations["en"];

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Banner */}
      <div className="bg-orange-600 border-b border-orange-700 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Collection
          </h1>
          <p className="mt-4 text-lg text-orange-100 max-w-2xl mx-auto">
            Browse through our wide selection of authentic, traditional, and spiritual products curated just for you.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-75"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No Products</h3>
            <p className="mt-1 text-sm text-gray-500">We couldn't find any products in the catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} lang={lang} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
