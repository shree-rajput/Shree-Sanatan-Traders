import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { LuRotateCcw, LuCircleCheck, LuShieldAlert, LuCircleHelp } from "react-icons/lu";

const ReturnsRefunds = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-green-50/30 py-20 font-sans relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[48px] shadow-2xl border-4 border-white p-10 md:p-16">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-16 h-16 bg-green-50 rounded-[24px] flex items-center justify-center text-green-600 shadow-sm">
                <LuRotateCcw size={32} />
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t('returns_refunds_title')}</h1>
          </div>
          
          <div className="space-y-12">
            <section className="bg-green-50/30 p-8 rounded-[32px] border-2 border-green-50">
              <div className="flex items-center gap-3 mb-4">
                 <LuCircleCheck className="text-green-600" size={24} />
                 <h2 className="text-xl font-black text-gray-800 tracking-tight">{t('returns_sec_1')}</h2>
              </div>
              <p className="text-gray-500 font-bold leading-relaxed">
                {t('returns_sec_1_desc')}
              </p>
            </section>

            <section className="p-8 border-2 border-green-50 rounded-[32px] bg-white">
              <div className="flex items-center gap-3 mb-4">
                 <LuShieldAlert className="text-green-600" size={24} />
                 <h2 className="text-xl font-black text-gray-800 tracking-tight">Non-Returnable Items</h2>
              </div>
              <p className="text-gray-500 font-bold leading-relaxed">
                Opened seed packets, used irrigation tools, and chemical fertilizers cannot be returned for safety and quality reasons.
              </p>
            </section>

            <section className="bg-green-50/30 p-8 rounded-[32px] border-2 border-green-50">
              <div className="flex items-center gap-3 mb-4">
                 <LuCircleHelp className="text-green-600" size={24} />
                 <h2 className="text-xl font-black text-gray-800 tracking-tight">Need Help?</h2>
              </div>
              <p className="text-gray-500 font-bold leading-relaxed">
                If you have questions about your return, contact us on WhatsApp or visit our store in Kargoon. We are committed to ensuring our farmers are satisfied.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefunds;
