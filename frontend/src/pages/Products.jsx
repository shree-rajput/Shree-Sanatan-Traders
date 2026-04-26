import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import useDebounce from "../hooks/useDebounce";
import { LuSearch, LuFilter, LuSlidersHorizontal, LuChevronRight, LuX } from "react-icons/lu";

const CATEGORIES = ["Trailers", "Irrigation", "Pumps", "Tools", "Seeds", "Fertilizers", "Spare Parts"];

const Products = ({ lang = "en" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [priceRange, setPriceRange] = useState(100000);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory !== "All") params.category = selectedCategory;
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, setSearchParams]);

  // Derive Filtered Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        p.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      
      const productPrice = p.variants?.[0]?.price || p.price || 0;
      const matchesPrice = productPrice <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOrder === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, debouncedSearch, selectedCategory, priceRange, sortOrder]);

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      
      {/* 🏙️ BREADCRUMB / HEADER */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
              <span className="opacity-50">Home</span>
              <LuChevronRight size={10} />
              <span>Explore Products</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
               Agricultural <span className="text-emerald-600">Equipment</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest leading-none mb-1">Total Items</span>
                   <span className="text-xl font-black text-emerald-800 leading-none">{filteredProducts.length}</span>
                </div>
                <div className="w-px h-8 bg-emerald-200"></div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest leading-none mb-1">Showing</span>
                   <span className="text-xl font-black text-emerald-800 leading-none">{selectedCategory}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 🛠️ SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-10">
            
            {/* Search Box */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Search Products</h3>
              <div className="relative group">
                 <input 
                   type="text"
                   placeholder="Try 'Trailer' or 'Tools'..."
                   value={localSearch}
                   onChange={(e) => setLocalSearch(e.target.value)}
                   className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none"
                 />
                 <LuSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Categories</h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === "All" ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-6">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Max Price: ₹{priceRange.toLocaleString()}</h3>
               <input 
                 type="range" 
                 min="100" 
                 max="200000" 
                 step="500"
                 value={priceRange}
                 onChange={(e) => setPriceRange(Number(e.target.value))}
                 className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
               />
               <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>₹100</span>
                  <span>₹2L+</span>
               </div>
            </div>

          </aside>

          {/* 📦 PRODUCT GRID */}
          <div className="flex-1 space-y-8">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-3xl border border-gray-100 shadow-sm">
               <button 
                 onClick={() => setIsMobileFilterOpen(true)}
                 className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-2xl text-emerald-700 text-sm font-black"
               >
                 <LuFilter size={18} /> Filters
               </button>

               <div className="hidden lg:flex items-center gap-4 px-4 text-sm font-bold text-gray-400">
                  <LuSlidersHorizontal size={18} />
                  <span>Showing {filteredProducts.length} Results</span>
               </div>

               <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-xs font-black text-gray-400 uppercase tracking-widest">Sort By</span>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-gray-50 border-none rounded-2xl px-5 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
               </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                 {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LuSearch size={32} className="text-gray-300" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2">No matches found</h2>
                 <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
                 <button 
                  onClick={() => { setLocalSearch(""); setSelectedCategory("All"); setPriceRange(200000); }}
                  className="mt-8 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
                 >
                   Clear All Filters
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 📱 MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm lg:hidden">
           <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white p-8 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                 <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full">
                    <LuX size={20} />
                 </button>
              </div>

              <div className="space-y-10 overflow-y-auto h-[calc(100%-80px)]">
                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Search</h3>
                    <input 
                       type="text"
                       placeholder="Search products..."
                       value={localSearch}
                       onChange={(e) => setLocalSearch(e.target.value)}
                       className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl text-sm font-medium border-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                       {["All", ...CATEGORIES].map(cat => (
                         <button 
                           key={cat}
                           onClick={() => setSelectedCategory(cat)}
                           className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedCategory === cat ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-100 text-gray-500"}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100"
                 >
                   Apply Filters
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Products;
