import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../utils/translations';

const Notfound = ({ lang = "en" }) => {
  const t = translations[lang] || translations["en"];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-green-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative text-center max-w-2xl mx-auto backdrop-blur-md bg-white/40 p-12 rounded-[2rem] shadow-2xl border border-white/50">
        <p className="text-sm font-bold text-emerald-600 tracking-[0.2em] uppercase mb-2">404 Error</p>
        <h1 className="mt-2 text-6xl font-extrabold tracking-tight text-gray-900 sm:text-8xl drop-shadow-sm">
          Oops!
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">{t.notFoundTitle || "Page Not Found"}</h2>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          We couldn't seem to find the page you're looking for on <span className="font-semibold text-emerald-700">Shree Sanatan Traders</span>. It might have been moved, deleted, or never existed.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          >
            {t.home || "Back to Home"}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-sm font-bold text-gray-900 shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            {lang === 'en' ? 'Go Back' : 'पीछे जाएं'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
