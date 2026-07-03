import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

import AiChatWidget from "../components/AiChatWidget";
const CATEGORIES_DATA = [
  {
    name: "PVC accessories",
    desc: "Complete range of fittings for secure connections",
    image: "/images/pvc_acc_cover.png",
    link: "/products?category=pvc-pipe",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Irrigation Systems",
    desc: "Smart water management for higher crop yields",
    image: "/images/cat_irrigation_cover.png",
    link: "/products?category=drip",
    className: "lg:col-span-2 lg:row-span-1",
  },
  {
    name: "G. I Item",
    desc: "Essential tools: Band , Flanch , Nipple etc",
    image: "/images/cat_parts_cover.png",
    link: "/products?category=gi-items",
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    name: "Pumps & Motors",
    desc: "High-efficiency water pumps",
    image: "/images/cat_pumps_cover.png",
    link: "/products?category=filter-items",
    className: "lg:col-span-1 lg:row-span-1",
  },
  // {
  //   name: "Spare Parts",
  //   desc: "Genuine replacements for machinery",
  //   image: "/images/cat_parts_cover.png",
  //   link: "/products?category=Spare",
  //   className: "lg:col-span-2 lg:row-span-1",
  // },
  // {
  //   name: "Accessories",
  //   desc: "Enhance and upgrade your farming equipment",
  //   image: "/images/cat_accessories_cover.png",
  //   link: "/products?category=Accessories",
  //   className: "lg:col-span-2 lg:row-span-1",
  // },
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
  const location = useLocation();
  // useEffect(() => {
  //   console.log("Fetching products for Home page...");
  //   API.get("/products")
  //     .then((res) => setProducts(res.data))
  //     .catch((err) => console.error(err))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(location.search);

        const category = params.get("category");

        let url = "/products";

        if (category) {
          url += `?category=${category}`;
        }

        console.log("API URL =>", url);

        const res = await API.get(url);

        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

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

      <AiChatWidget />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[220px] lg:auto-rows-[280px]">
          {CATEGORIES_DATA.map((cat, i) => (
            <Link
              key={i}
              to={cat.link}
              className={`group relative overflow-hidden rounded-[32px] bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 active:scale-[0.98] ${cat.className}`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

              <div className="relative z-20 flex flex-col h-full justify-end p-8">
                <h3 className="font-black text-white text-2xl lg:text-3xl mb-1 drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {cat.name}
                </h3>

                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-300 leading-relaxed opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    {cat.desc}
                  </p>
                </div>

                <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <ArrowRight
                    size={20}
                    className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100"
                  />
                </div>
              </div>
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
                Shree Sanatani
                <br />
                <span className="text-green-600">Traders</span>
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
                src="/images/shop_front.jpeg"
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
              Kargone District, Bamandi <br />
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
