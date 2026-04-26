import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { Link } from "react-router-dom";
import { 
  LuArrowRight as ArrowRight, 
  LuShoppingCart as ShoppingCart, 
  LuPhone as Phone, 
  LuTruck as Truck, 
  LuShieldCheck as ShieldCheck, 
  LuCircleDollarSign as CircleDollarSign, 
  LuUsers as Users, 
  LuStar as Star, 
  LuMessageSquareQuote as MessageSquareQuote,
  LuMapPin as MapPin,
  LuMessageCircle as MessageCircle,
  LuMail as Mail,
  LuChevronRight as ChevronRight
} from "react-icons/lu";

const CATEGORIES = [
  { name: "Trailers", image: "/images/cat_trailers.png", link: "/products?category=Trailers" },
  { name: "Irrigation Kits", image: "/images/cat_irrigation.png", link: "/products?category=Irrigation" },
  { name: "Farming Tools", image: "/images/cat_irrigation.png", link: "/products?category=Tools" }, // Using irrigation as placeholder
  { name: "Seeds & Accessories", image: "/images/cat_irrigation.png", link: "/products?category=Seeds" },
  { name: "Spare Parts", image: "/images/cat_pumps.png", link: "/products?category=Spare" },
  { name: "Pumps & Motors", image: "/images/cat_pumps.png", link: "/products?category=Pumps" },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Patil",
    text: "Very good quality irrigation kit. Water saving and highly useful. Highly recommended!",
    rating: 5
  },
  {
    name: "Suresh Jadhav",
    text: "Products are affordable and durable. Service is also very good.",
    rating: 5
  },
  {
    name: "Mahadev More",
    text: "Best shop in our area for all farming needs.",
    rating: 5
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white font-sans text-gray-900">
      {/* 🌾 HERO SECTION */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="/images/hero.png" 
          alt="Agriculture Field" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-gray-900">
              Reliable Agriculture <br />
              Equipment for <br />
              <span className="text-green-700">Every Farmer</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 font-medium max-w-md">
              Best Quality Irrigation Kits, Tools & Trailers at Affordable Prices.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-green-800 transition-all shadow-lg hover:shadow-green-200"
              >
                <ShoppingCart size={20} />
                Shop Now
              </Link>
              <a 
                href="tel:+919876543210"
                className="bg-white text-green-700 border-2 border-green-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-all"
              >
                <Phone size={20} />
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          <span className="w-3 h-3 rounded-full bg-green-700 shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-white/50 cursor-pointer"></span>
          <span className="w-3 h-3 rounded-full bg-white/50 cursor-pointer"></span>
          <span className="w-3 h-3 rounded-full bg-white/50 cursor-pointer"></span>
        </div>
      </section>

      {/* 🧱 SHOP BY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
            Shop by Categories
          </h2>
          <div className="flex justify-center mt-2">
             <div className="w-24 h-1 bg-green-700 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link 
              key={i} 
              to={cat.link}
              className="group flex flex-col items-center bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-green-100 transition-all duration-300"
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-50 mb-4">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-gray-800 text-center">{cat.name}</h3>
              <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight size={12} />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔥 FEATURED PRODUCTS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
            <div className="flex justify-center mt-2">
              <div className="w-24 h-1 bg-green-700 rounded-full"></div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((p) => (
                <div key={p._id} className="relative group">
                   <span className="absolute top-4 left-4 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">New</span>
                   <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ WHY CHOOSE US */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-green-50 transition-colors">
              <div className="bg-green-100 p-3 rounded-xl text-green-700">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Trusted Local Seller</h4>
                <p className="text-sm text-gray-500 mt-1">Serving farmers in Kargoon & nearby areas.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-green-50 transition-colors">
              <div className="bg-green-100 p-3 rounded-xl text-green-700">
                <Truck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-sm text-gray-500 mt-1">Quick and secure delivery to your doorstep.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-green-50 transition-colors">
              <div className="bg-green-100 p-3 rounded-xl text-green-700">
                <CircleDollarSign size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Affordable Prices</h4>
                <p className="text-sm text-gray-500 mt-1">Best quality products at the best prices.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-green-50 transition-colors">
              <div className="bg-green-100 p-3 rounded-xl text-green-700">
                <Users size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Farmer Friendly</h4>
                <p className="text-sm text-gray-500 mt-1">Products selected for farmers' real needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏪 ABOUT US SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Storefront Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="/images/storefront.png" alt="Our Store" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-green-900/10"></div>
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold tracking-wide">
                About Our Shop
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Sri Sanatan <br />
                <span className="text-green-700">Dharma Trailers</span>
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                A trusted name in agriculture equipment, located in Kargoon District, Bamandi. 
                We are driven by two dedicated individuals committed to providing quality products 
                and excellent service to our farmers.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-green-600"><ShieldCheck size={20} /></div>
                  <span className="font-bold text-sm">Quality Products</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="text-green-600"><Users size={20} /></div>
                  <span className="font-bold text-sm">Customer Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Founders Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img src="/images/founders.png" alt="Founders" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-lg">Our Founders</p>
                <p className="text-sm opacity-80">Serving farmers since 1995</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">What Our Customers Say</h2>
            <div className="flex justify-center mt-2">
              <div className="w-24 h-1 bg-green-700 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all relative">
                <div className="absolute -top-4 -right-4 bg-green-50 p-4 rounded-2xl text-green-200">
                  <MessageSquareQuote size={40} />
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Happy Farmer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 CONTACT BAR */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          {/* Visit Us */}
          <div className="bg-white p-10 flex flex-col items-center text-center border-r border-gray-50">
            <div className="bg-green-700 text-white p-4 rounded-2xl mb-4">
              <MapPin size={32} />
            </div>
            <h4 className="font-black text-lg">Visit Us</h4>
            <p className="text-gray-500 mt-2 text-sm">Kargoon District, Bamandi <br />Maharashtra, India</p>
          </div>

          {/* Call Us */}
          <div className="bg-white p-10 flex flex-col items-center text-center border-r border-gray-50">
            <div className="bg-green-700 text-white p-4 rounded-2xl mb-4">
              <Phone size={32} />
            </div>
            <h4 className="font-black text-lg">Call Us</h4>
            <p className="text-gray-500 mt-2 text-sm">+91 98765 43210 <br />+91 87654 32109</p>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-10 flex flex-col items-center text-center">
            <div className="bg-green-600 text-white p-4 rounded-2xl mb-4">
              <MessageCircle size={32} />
            </div>
            <h4 className="font-black text-lg">WhatsApp</h4>
            <p className="text-gray-500 mt-2 text-sm">Chat with us on WhatsApp <br />for quick support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
