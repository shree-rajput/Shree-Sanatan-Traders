import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { LuMail, LuPhone, LuMapPin, LuSend, LuMessageSquare, LuLoaderCircle } from "react-icons/lu";

const ContactUs = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API Call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t('message_sent') || "Message sent! Our support team will reach out shortly.");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-20 font-sans relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[48px] shadow-2xl border-4 border-white overflow-hidden flex flex-col lg:flex-row">
          
          {/* Contact Details Panel */}
          <div className="lg:w-2/5 bg-green-600 text-white p-12 md:p-16 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 tracking-tight">{t('get_in_touch')}</h2>
              <p className="text-green-100 font-bold leading-relaxed mb-12 opacity-90">
                {t('contact_desc')}
              </p>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 bg-white/10 rounded-[18px] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-green-600 transition-all">
                      <LuMapPin size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-green-100 mb-1">{t('our_location')}</p>
                      <p className="text-lg font-bold leading-tight">
                        Main Market Area, Kargoon,<br/> Madhya Pradesh 451001
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 bg-white/10 rounded-[18px] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-green-600 transition-all">
                      <LuPhone size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-green-100 mb-1">{t('call_us') || "Call Us"}</p>
                      <p className="text-xl font-black tracking-wider">+91 98765 43210</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 bg-white/10 rounded-[18px] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-green-600 transition-all">
                      <LuMail size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-green-100 mb-1">{t('email_us') || "Email Us"}</p>
                      <p className="text-lg font-bold">support@shreesanatan.com</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/20 relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-200 mb-4">Farmer Support Line</p>
               <p className="text-sm font-bold opacity-80 leading-relaxed">Available Monday - Saturday: 9:00 AM to 7:00 PM</p>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="lg:w-3/5 p-12 md:p-16">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-green-50 rounded-[20px] flex items-center justify-center text-green-600 shadow-sm">
                  <LuMessageSquare size={24} />
               </div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('send_message') || "Send us a Message"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('name')}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-green-50/50 border-2 border-transparent rounded-[24px] px-6 py-4 focus:outline-none focus:bg-white focus:border-green-200 focus:ring-8 focus:ring-green-500/5 transition-all font-bold text-gray-800 placeholder-gray-300"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('email')}</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-green-50/50 border-2 border-transparent rounded-[24px] px-6 py-4 focus:outline-none focus:bg-white focus:border-green-200 focus:ring-8 focus:ring-green-500/5 transition-all font-bold text-gray-800 placeholder-gray-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{t('message')}</label>
                <textarea 
                  required 
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-green-50/50 border-2 border-transparent rounded-[32px] px-8 py-6 focus:outline-none focus:bg-white focus:border-green-200 focus:ring-8 focus:ring-green-500/5 transition-all font-bold text-gray-800 placeholder-gray-300 resize-none shadow-inner"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black px-10 py-5 rounded-[28px] shadow-2xl shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                   <LuLoaderCircle className="animate-spin" size={24} />
                ) : (
                   <>
                      {t('send_btn') || "Send Message"} <LuSend size={20} />
                   </>
                )}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
