import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { LuPackage, LuCircleCheck, LuArrowRight, LuUsers } from "react-icons/lu";

const BulkOrders = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-green-50/30 py-20 font-sans relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[48px] shadow-2xl border-4 border-white p-10 md:p-16 text-center">
          <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center text-green-600 shadow-sm mx-auto mb-8">
             <LuPackage size={48} />
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">{t('bulk_orders_title')}</h1>
          <p className="text-lg text-gray-400 font-bold max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('bulk_desc')}
          </p>
          
          <div className="bg-green-50/30 border-2 border-green-50 rounded-[40px] p-10 mb-12 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-green-100 pointer-events-none">
               <LuUsers size={120} />
            </div>
            
            <h3 className="text-xl font-black text-green-800 mb-8 tracking-tight flex items-center gap-3">
               <LuCircleCheck className="text-green-600" /> Bulk Order Benefits:
            </h3>
            
            <ul className="space-y-6 relative z-10">
              <li className="flex items-center gap-4 text-green-900 font-black text-sm uppercase tracking-widest">
                <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg">✓</div>
                Special Farmer Group Discounts
              </li>
              <li className="flex items-center gap-4 text-green-900 font-black text-sm uppercase tracking-widest">
                <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg">✓</div>
                Priority Large-Scale Delivery
              </li>
              <li className="flex items-center gap-4 text-green-900 font-black text-sm uppercase tracking-widest">
                <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg">✓</div>
                Custom Seed & Tool Sourcing
              </li>
              <li className="flex items-center gap-4 text-green-900 font-black text-sm uppercase tracking-widest">
                <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg">✓</div>
                Dedicated Support for Big Farms
              </li>
            </ul>
          </div>

          <Link 
            to="/contact" 
            className="inline-flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-black text-xl px-12 py-5 rounded-[28px] shadow-2xl shadow-green-200 transition-all hover:scale-105 active:scale-95"
          >
            {t('contact_us_title')} <LuArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BulkOrders;
