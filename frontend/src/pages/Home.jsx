import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { useLanguage } from "../context/LanguageContext";
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
  LuChevronRight as ChevronRight,
} from "react-icons/lu";

const CATEGORIES_DATA = [
  {
    name: "Trailers",
    image: "/images/cat_trailers.png",
    link: "/products?category=Trailers",
  },
  {
    name: "Irrigation Kits",
    image: "/images/cat_irrigation.png",
    link: "/products?category=Irrigation",
  },
  {
    name: "Farming Tools",
    image: "/images/cat_irrigation.png",
    link: "/products?category=Tools",
  },
  {
    name: "Accessories",
    image: "/images/cat_irrigation.png",
    link: "/products?category=Accessories",
  },
  {
    name: "Spare Parts",
    image: "/images/cat_pumps.png",
    link: "/products?category=Spare",
  },
  {
    name: "Pumps & Motors",
    image: "/images/cat_pumps.png",
    link: "/products?category=Pumps",
  },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Patil",
    text: "Very good quality irrigation kit. Water saving and highly useful. Highly recommended!",
    rating: 5,
  },
  {
    name: "Suresh Jadhav",
    text: "Products are affordable and durable. Service is also very good.",
    rating: 5,
  },
  {
    name: "Mahadev More",
    text: "Best shop in our area for all farming needs.",
    rating: 5,
  },
];

const Home = () => {
  const { t } = useLanguage();
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
      <section className="relative h-[500px] md:h-[650px] overflow-hidden">
        <img
          src="/images/hero.png"
          alt="Agriculture Field"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-gray-900 tracking-tight">
              {t("hero_main_title")}
            </h1>
            <p className="mt-6 text-xl text-gray-600 font-medium max-w-md">
              {t("hero_main_subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-green-600 text-white px-10 py-5 rounded-[20px] font-black flex items-center gap-2 hover:bg-green-700 transition-all shadow-2xl shadow-green-200 text-lg active:scale-95"
              >
                <ShoppingCart size={24} />
                {t("shop_now")}
              </Link>
              <a
                href="tel:+919876543210"
                className="bg-white text-green-700 border-4 border-green-600 px-10 py-5 rounded-[20px] font-black flex items-center gap-2 hover:bg-green-50 transition-all text-lg active:scale-95"
              >
                <Phone size={24} />
                {t("call_now")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🧱 SHOP BY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            {t("shop_by_categories")}
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-32 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES_DATA.map((cat, i) => (
            <Link
              key={i}
              to={cat.link}
              className="group flex flex-col items-center bg-white border-2 border-green-50 rounded-[32px] p-6 hover:shadow-2xl hover:border-green-200 transition-all duration-300 active:scale-95"
            >
              <div className="w-full aspect-square overflow-hidden rounded-2xl bg-green-50/30 mb-4 p-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-black text-gray-800 text-center text-sm">
                {cat.name}
              </h3>
              <p className="text-[10px] font-black text-green-600 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                Explore <ArrowRight size={12} />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔥 FEATURED PRODUCTS */}
      <section className="bg-green-50/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {t("featured_products")}
            </h2>
            <div className="flex justify-center mt-4">
              <div className="w-32 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-green-700 font-black text-lg hover:underline decoration-4 underline-offset-8 transition-all"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-[40px] bg-green-50/50 border-2 border-transparent hover:border-green-100 transition-all">
              <div className="bg-green-600 p-5 rounded-2xl text-white shadow-xl shadow-green-100 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-black text-gray-900 text-lg mb-2">
                {t("trusted_seller")}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {t("trusted_seller_desc")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[40px] bg-green-50/50 border-2 border-transparent hover:border-green-100 transition-all">
              <div className="bg-green-600 p-5 rounded-2xl text-white shadow-xl shadow-green-100 mb-6">
                <Truck size={32} />
              </div>
              <h4 className="font-black text-gray-900 text-lg mb-2">
                {t("fast_delivery")}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {t("fast_delivery_desc")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[40px] bg-green-50/50 border-2 border-transparent hover:border-green-100 transition-all">
              <div className="bg-green-600 p-5 rounded-2xl text-white shadow-xl shadow-green-100 mb-6">
                <CircleDollarSign size={32} />
              </div>
              <h4 className="font-black text-gray-900 text-lg mb-2">
                {t("affordable_prices")}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {t("affordable_prices_desc")}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-[40px] bg-green-50/50 border-2 border-transparent hover:border-green-100 transition-all">
              <div className="bg-green-600 p-5 rounded-2xl text-white shadow-xl shadow-green-100 mb-6">
                <Users size={32} />
              </div>
              <h4 className="font-black text-gray-900 text-lg mb-2">
                {t("farmer_friendly")}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {t("farmer_friendly_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏪 ABOUT US SECTION */}
      <section className="py-24 bg-green-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* About Text */}
            <div className="space-y-8">
              <div className="inline-block px-6 py-2 bg-green-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                {t("about_shop")}
              </div>
              <h2 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">
                Shree Sanatan <br />
                <span className="text-green-600">Dharma Traders</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {t("about_desc")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-green-100">
                  <div className="text-green-600 bg-green-50 p-3 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="font-black text-gray-800 uppercase tracking-widest text-xs">
                    Quality Products
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-green-100">
                  <div className="text-green-600 bg-green-50 p-3 rounded-xl">
                    <Users size={24} />
                  </div>
                  <span className="font-black text-gray-800 uppercase tracking-widest text-xs">
                    Customer Focus
                  </span>
                </div>
              </div>
            </div>

            {/* Store Image */}
            <div className="relative rounded-[64px] overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src="/images/storefront.png"
                alt="Our Store"
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {t("what_customers_say")}
            </h2>
            <div className="flex justify-center mt-4">
              <div className="w-32 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border-2 border-green-50 p-10 rounded-[48px] shadow-sm hover:shadow-2xl hover:border-green-100 transition-all relative group"
              >
                <div className="absolute -top-6 -right-6 bg-green-600 p-6 rounded-[24px] text-white shadow-xl shadow-green-100 group-hover:rotate-12 transition-transform">
                  <MessageSquareQuote size={32} />
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-600 italic leading-relaxed mb-8 font-medium">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-100">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-none mb-1">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">
                      Happy Farmer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 CONTACT BAR */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-0 rounded-[64px] overflow-hidden shadow-2xl border-4 border-white">
          {/* Visit Us */}
          <div className="bg-white p-12 flex flex-col items-center text-center border-r-2 border-green-50">
            <div className="bg-green-600 text-white p-6 rounded-[24px] mb-6 shadow-xl shadow-green-100">
              <MapPin size={40} />
            </div>
            <h4 className="font-black text-xl mb-2">{t("visit_us")}</h4>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">
              Kargoon District, Bamandi <br />
              Madhya Pradesh, India
            </p>
          </div>

          {/* Call Us */}
          <div className="bg-white p-12 flex flex-col items-center text-center border-r-2 border-green-50">
            <div className="bg-green-600 text-white p-6 rounded-[24px] mb-6 shadow-xl shadow-green-100">
              <Phone size={40} />
            </div>
            <h4 className="font-black text-xl mb-2">{t("call_us")}</h4>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">
              +91 98765 43210 <br />
              +91 87654 32109
            </p>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-12 flex flex-col items-center text-center">
            <div className="bg-[#25D366] text-white p-6 rounded-[24px] mb-6 shadow-xl shadow-green-100">
              <MessageCircle size={40} />
            </div>
            <h4 className="font-black text-xl mb-2">{t("whatsapp")}</h4>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">
              {t("chat_on_whatsapp")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
