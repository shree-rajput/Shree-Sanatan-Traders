import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { translations } from "../utils/translations";
import { Link } from "react-router-dom";

const Home = ({ lang = "en" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[lang] || translations["en"]; // Fallback

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 bg-gradient-to-r from-orange-600 to-orange-400">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="relative px-8 py-20 md:py-32 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
              {t.appName || "Shree Sanatan Traders"}
            </h1>
            <p className="text-lg md:text-2xl text-orange-50 font-medium mb-10 max-w-2xl drop-shadow">
              {t.tagline || "Discover Premium Quality Spiritual and Traditional Products"}
            </p>
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-orange-50 transition-all duration-300 text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4">
            {t.products || "Featured Products"}
          </h2>
          <Link
            to="/products"
            className="text-orange-600 font-semibold hover:text-orange-700 transition"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-75"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-orange-100">
            <p className="text-gray-500 text-lg">{t.noProducts || "No products found."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} lang={lang} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;