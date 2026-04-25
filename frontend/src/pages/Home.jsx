import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Trailers", icon: "🚜" },
  { name: "Irrigation Kits", icon: "💧" },
  { name: "PVC Accessories", icon: "🔩" },
  { name: "Farming Tools", icon: "🛠️" },
  { name: "Pumps & Motors", icon: "⚙️" },
  { name: "Spare Parts", icon: "🔧" },
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
    <div className="bg-white">
      {/* 🌾 HERO SECTION */}
      {/* <section className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Reliable Agriculture Equipment <br />
              <span className="text-yellow-300">for Every Farmer</span>
            </h1>

            <p className="mt-6 text-lg text-green-100">
              Best quality irrigation kits, trailers, PVC accessories and
              farming tools at affordable prices.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/products"
                className="bg-emerald-500 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400"
              >
                Shop Now
              </Link>
              <a
                href="tel:+919876543210"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800"
              >
                Call Now
              </a>
            </div>
          </div>

          <div>
            <img
              src="data:image/jpeg;base64,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"
              alt="farming"
              className="rounded-2xl shadow-xl w-[400px] h-[400px] object-cover mb-4"
            />
          </div>
        </div>
      </section> */}

      {/* <section className="max-w-7xl mx-auto mt-6 bg-white rounded-2xl shadow overflow-hidden">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-10">
            <h1 className="text-4xl font-extrabold leading-tight">
              Reliable Agriculture Equipment for <br />
              <span className="text-green-700">Every Farmer</span>
            </h1>

            <p className="mt-4 text-gray-600">
              Best Quality Irrigation Kits, Tools & Trailers at Affordable
              Prices.
            </p>

            <div className="mt-6 flex gap-4">
              <button className="bg-green-700 text-white px-6 py-3 rounded-lg">
                Shop Now
              </button>
              <button className="border px-6 py-3 rounded-lg text-green-700">
                Call Now
              </button>
            </div>
          </div>

          <img
            src="/images/hero.jpg"
            alt="hero"
            className="h-full w-full object-cover"
          />
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto mt-6 px-4">
        <div className="relative rounded-2xl overflow-hidden shadow bg-white">
          {/* Background Image */}
          <img
            src="data:image/jpeg;base64,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"
            alt="hero"
            className="w-full h-[420px] object-cover"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Reliable Agriculture Equipment for{" "}
                <span className="text-green-700">Every Farmer</span>
              </h1>

              <p className="mt-4 text-gray-600 text-lg">
                Best Quality Irrigation Kits, Tools & Trailers at Affordable
                Prices.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                  Shop Now
                </button>

                <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                  Call Now
                </button>
              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-3 h-3 bg-green-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 🧱 CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Shop by Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={`/products?search=${cat.name}`}
              className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-semibold">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔥 FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-emerald-600 font-semibold">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ WHY CHOOSE US */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="font-bold text-lg">Trusted Local Seller</h3>
            <p className="text-gray-500 text-sm mt-2">
              Serving farmers in your area
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Fast Delivery</h3>
            <p className="text-gray-500 text-sm mt-2">
              Quick doorstep delivery
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Affordable Prices</h3>
            <p className="text-gray-500 text-sm mt-2">Best value products</p>
          </div>

          <div>
            <h3 className="font-bold text-lg">Farmer Friendly</h3>
            <p className="text-gray-500 text-sm mt-2">Easy to use equipment</p>
          </div>
        </div>
      </section>

      {/* 🏪 ABOUT / TRUST */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2 gap-8 items-center">
          {/* 🏪 LEFT SIDE (SHOP IMAGE) */}
          <div className="p-4">
            <img
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAEUsg4qS_9A0GGSCvu8SXhKcs3CWcjoVtpaFOWRQ_VoxyVjaytMkP174t4pElft0RMefbe-JB_GUCVmWgU896nX-baVgNTUE56uUKjeM9RW40IV1aoppBLhCiH3ltM1ODc83lxa6w=s1360-w1360-h1020-rw"
              alt="shop"
              className="w-[200px] h-[200px] object-cover rounded-xl"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 flex flex-col justify-between h-full">
            {/* TEXT */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                About{" "}
                <span className="text-green-700">
                  Sri Sanatan Dharma Trailers
                </span>
              </h2>

              <p className="text-gray-600 mt-4 leading-relaxed">
                A trusted agriculture equipment store located in Kargoon
                District, Bamandi. We are driven by dedicated individuals
                committed to providing quality products and excellent service to
                farmers.
              </p>
            </div>

            {/* FEATURES */}
            <div className="flex gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-700 text-xl">✔</span>
                <span className="text-sm font-medium text-gray-700">
                  Quality Products
                </span>
              </div>

              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-green-700 text-xl">👍</span>
                <span className="text-sm font-medium text-gray-700">
                  Customer Satisfaction
                </span>
              </div>
            </div>

            {/* 👨‍🌾 OWNER IMAGE */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
