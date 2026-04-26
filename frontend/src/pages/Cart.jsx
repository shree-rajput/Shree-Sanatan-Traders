import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { 
  LuTrash2, 
  LuPlus, 
  LuMinus, 
  LuShoppingBag, 
  LuChevronRight, 
  LuShieldCheck, 
  LuTruck,
  LuLoaderCircle
} from "react-icons/lu";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError("Please provide a shipping address.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const orderPayload = {
        shippingAddress: address,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.qty || 1,
          price: item.price
        })),
        totalAmount: totalPrice
      };

      await API.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] py-12 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping <span className="text-emerald-600">Cart</span></h1>
           <p className="text-gray-500 font-medium mt-1">Review your items before secure checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LuShoppingBag size={40} className="text-gray-300" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
             <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
               Looks like you haven't added anything yet. Explore our premium equipment to get started.
             </p>
             <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
             >
               Browse Shop <LuChevronRight size={18} />
             </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group transition-all hover:shadow-lg hover:border-emerald-50">
                  
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden p-4 shrink-0">
                    <img 
                      src={item.images?.[0] || "/box1.png"} 
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.name}</h3>
                       <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{item.category || "General"}</p>
                       <p className="text-sm font-bold text-gray-400 mt-2">Unit: {item.unit || "1 Pc"}</p>
                    </div>

                    <div className="flex flex-col md:items-end gap-4">
                       <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                          <button 
                            onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
                          >
                            <LuMinus size={16} />
                          </button>
                          <span className="text-sm font-black text-gray-900 w-4 text-center">{item.qty || 1}</span>
                          <button 
                            onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
                          >
                            <LuPlus size={16} />
                          </button>
                       </div>
                       <p className="text-xl font-black text-gray-900 tracking-tight">₹{(item.price * (item.qty || 1)).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <LuTrash2 size={22} />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center pt-6">
                 <Link to="/products" className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">
                    <LuChevronRight className="rotate-180" size={16} /> Continue Shopping
                 </Link>
                 <button 
                  onClick={clearCart}
                  className="text-sm font-black text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                 >
                   Clear Cart
                 </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="w-full lg:w-[400px] space-y-8">
               <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-emerald-900/5 sticky top-32">
                  <h3 className="text-xl font-black text-gray-900 mb-8 pb-6 border-b border-gray-50">Order Summary</h3>
                  
                  <div className="space-y-4 mb-10">
                     <div className="flex justify-between text-sm font-bold text-gray-500">
                        <span>Subtotal ({totalItems} items)</span>
                        <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm font-bold text-gray-500">
                        <span>Shipping</span>
                        <span className="text-emerald-600">Calculated Next</span>
                     </div>
                     <div className="h-px bg-gray-50 my-4"></div>
                     <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-gray-900">Total Price</span>
                        <span className="text-3xl font-black text-emerald-600 tracking-tight">₹{totalPrice.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                        <textarea 
                           rows="3"
                           className={`w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold outline-none resize-none ${error ? 'border-red-200 bg-red-50' : ''}`}
                           placeholder="Enter full village address..."
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                        />
                        {error && <p className="text-[10px] font-bold text-red-500 ml-1 tracking-tight">{error}</p>}
                     </div>

                     <button 
                        onClick={handleCheckout}
                        disabled={placingOrder}
                        className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black shadow-2xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {placingOrder ? (
                           <>
                              <LuLoaderCircle className="animate-spin" size={24} />
                              Placing Order...
                           </>
                        ) : (
                           <>
                              Proceed to Checkout <LuChevronRight size={20} />
                           </>
                        )}
                     </button>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <LuShieldCheck className="text-emerald-500" size={16} /> Secure Payment
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <LuTruck className="text-emerald-500" size={16} /> Quick Delivery
                     </div>
                  </div>
               </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
