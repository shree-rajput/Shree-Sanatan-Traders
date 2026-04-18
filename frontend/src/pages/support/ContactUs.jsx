import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API Call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! Our support team will reach out shortly.");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Contact Details Panel */}
          <div className="lg:w-1/3 bg-gradient-to-b from-green-800 to-green-900 text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold mb-4 text-emerald-400">Get in Touch</h2>
              <p className="text-green-100 font-medium leading-relaxed mb-10">
                Whether you have a question about our products, shipping, bulk pricing, or just want to say hello, our team is ready to answer all your queries.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="text-emerald-400 text-2xl mr-4 flex-shrink-0">📍</span>
                  <p className="text-sm font-medium leading-relaxed">
                    123 Agriculture Market Yard,<br/> District Centre, State 400001
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-emerald-400 text-2xl mr-4 flex-shrink-0">📞</span>
                  <p className="text-sm font-medium font-mono tracking-wider">+91 98765 43210</p>
                </div>
                <div className="flex items-center">
                  <span className="text-emerald-400 text-2xl mr-4 flex-shrink-0">✉️</span>
                  <p className="text-sm font-medium">support@shreesanatan.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="lg:w-2/3 p-10 md:p-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm bg-gray-50 hover:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm bg-gray-50 hover:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea 
                  required 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm bg-gray-50 hover:bg-white resize-y"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 block text-center ${
                  isSubmitting ? "bg-emerald-400 cursor-not-allowed opacity-70" : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30 text-white"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
