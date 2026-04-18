import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { translations } from "../utils/translations";

const Products = ({ lang = "en" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL & Filtering State
  const [searchParams] = useSearchParams();
  const urlSearchTrigger = searchParams.get("search") || "";
  
  const [localSearch, setLocalSearch] = useState(urlSearchTrigger);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState(""); // "low-high", "high-low"

  const t = translations[lang] || translations["en"];

  // Sync URL search params to local input if users use the distinct Navbar search
  useEffect(() => {
    setLocalSearch(urlSearchTrigger);
  }, [urlSearchTrigger]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute Categories dynamically from fetched products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Derived State Engine: Filter & Sort on the fly (Kisanshop-level UX response)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (localSearch) {
      result = result.filter(p => p.name.toLowerCase().includes(localSearch.toLowerCase()));
    }

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortOrder === "low-high") {
      result.sort((a, b) => {
          const priceA = a.variants?.[0]?.price || a.price || 0;
          const priceB = b.variants?.[0]?.price || b.price || 0;
          return priceA - priceB;
      });
    } else if (sortOrder === "high-low") {
      result.sort((a, b) => {
          const priceA = a.variants?.[0]?.price || a.price || 0;
          const priceB = b.variants?.[0]?.price || b.price || 0;
          return priceB - priceA;
      });
    }

    return result;
  }, [products, localSearch, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Banner */}
      <div className="bg-emerald-600 border-b border-emerald-700 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.exploreShop}
          </h1>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
            {t.tagline}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Advanced Filtering Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
           <div className="relative flex-1 max-w-sm">
             <input 
               type="text" 
               placeholder={t.search} 
               value={localSearch}
               onChange={(e) => setLocalSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
             />
             <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4">
             <select 
               value={selectedCategory} 
               onChange={(e)=>setSelectedCategory(e.target.value)}
               className="w-full sm:w-auto border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-700 bg-gray-50"
             >
               {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? (lang === 'en' ? 'All Categories' : 'सभी श्रेणियां') : cat}</option>)}
             </select>
             
             <select 
               value={sortOrder} 
               onChange={(e)=>setSortOrder(e.target.value)}
               className="w-full sm:w-auto border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-700 bg-gray-50"
             >
               <option value="">{lang === 'en' ? 'Sort by Relevance' : 'प्रासंगिकता के आधार पर'}</option>
               <option value="low-high">{lang === 'en' ? 'Price: Low to High' : 'कीमत: कम से ज्यादा'}</option>
               <option value="high-low">{lang === 'en' ? 'Price: High to Low' : 'कीमत: ज्यादा से कम'}</option>
             </select>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{lang === 'en' ? 'No matches found' : 'कोई मिलान नहीं मिला'}</h3>
            <p className="mt-1 text-sm text-gray-500">{lang === 'en' ? "We couldn't find anything matching your filters or search query." : "हमें आपके फिल्टर या खोज प्रश्न से मेल खाने वाला कुछ नहीं मिला।"}</p>
            {(localSearch || selectedCategory !== "All") && (
              <button 
                onClick={() => { setLocalSearch(""); setSelectedCategory("All"); setSortOrder(""); }} 
                className="mt-4 text-emerald-600 font-bold hover:underline"
              >
                {lang === 'en' ? 'Clear all filters' : 'सभी फिल्टर हटाएं'}
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-6 font-medium">{lang === 'en' ? 'Showing' : 'दिखा रहा है'} {filteredProducts.length} {lang === 'en' ? 'results' : 'परिणाम'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
