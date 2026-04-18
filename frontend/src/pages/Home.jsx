import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { translations } from "../utils/translations";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Seeds", icon: "🌱", color: "bg-emerald-50" },
  { name: "Fertilizers", icon: "💧", color: "bg-emerald-50" },
  { name: "Tools", icon: "🚜", color: "bg-emerald-50" },
  { name: "Organics", icon: "🌿", color: "bg-emerald-50" },
  { name: "Spiritual", icon: "📿", color: "bg-emerald-50" },
  { name: "Hardware", icon: "⚙️", color: "bg-emerald-50" },
];

const Home = ({ lang = "en" }) => {
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
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* 🚀 Advanced Hero Banner (Promotions Carousel Style) */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b-4 border-emerald-600 relative">
        {/* Subtle texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center py-20 lg:py-28 text-center">
          <span className="bg-emerald-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-xl shadow-emerald-900/40 animate-bounce">
            {t.saleText}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
             {t.heroTitle} <br /> <span className="text-emerald-400">{t.heroSubtitle}</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 font-medium mb-10 max-w-2xl drop-shadow">
             {t.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-1 hover:bg-emerald-500 transition-all duration-300 text-lg"
            >
              {t.exploreShop}
            </Link>
            <Link
              to="/orders"
              className="px-10 py-4 bg-transparent border-2 border-emerald-400/50 text-white font-bold rounded-full hover:border-emerald-300 hover:bg-emerald-800/50 transition-all duration-300 text-lg backdrop-blur-sm"
            >
              {t.trackOrder}
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* 📑 Shop By Category Ribbon */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">{t.exploreCategory}</h2>
          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={i} 
                to={`/products?search=${cat.name}`}
                className={`min-w-[140px] flex flex-col items-center justify-center p-8 rounded-3xl ${cat.color} border border-white shadow-sm hover:shadow-emerald-100 hover:-translate-y-2 transition-all duration-500 cursor-pointer group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                <span className="font-extrabold text-gray-800 text-sm tracking-wide">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 🌟 Best Sellers Section */}
        <section className="mb-16">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t.bestSellers}</h2>
              <p className="text-gray-500 mt-2 font-medium">{t.bestSellersDesc}</p>
            </div>
            <Link to="/products" className="text-emerald-600 font-extrabold hover:text-emerald-800 transition mt-4 sm:mt-0 flex items-center gap-2 group">
              {t.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center bg-gray-50 p-12 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-medium">We are currently restocking our inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
              {products.slice(0, 4).map((p) => {
                // Mock applying 'isFeatured' badge onto the first few items to test new ProductCard logic
                const mockFeatureProduct = { ...p, isFeatured: Math.random() > 0.5 };
                return <ProductCard key={p._id} product={mockFeatureProduct} lang={lang} />
              })}
            </div>
          )}
        </section>

        {/* New Section */}
        <section className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          <div className="md:w-1/2">
             <h2 className="text-4xl font-black text-emerald-900 leading-tight mb-6">{t.expertTitle}</h2>
             <p className="text-emerald-800/80 font-medium text-lg leading-relaxed mb-8">
               {t.expertDesc}
             </p>
             <Link to="/contact" className="inline-block bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition">
               {t.talkExpert}
             </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <span className="text-9xl filter drop-shadow-2xl">🚜</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;