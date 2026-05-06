import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { LuTrash2, LuPlus, LuMinus, LuShoppingBag, LuChevronRight, LuLoaderCircle, LuArrowRight } from "react-icons/lu";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.qty || 1,
          price: item.price
        })),
        totalAmount: totalPrice
      };

      await API.post("/orders", orderPayload);
      clearCart();
      toast.success("Order placed successfully!", { icon: '🌾' });
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your <span className="text-green-600">Shopping Cart</span></h1>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{totalItems} Items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 text-center bg-gray-50 rounded-3xl border border-gray-100">
            <LuShoppingBag size={48} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some agricultural tools to get started.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
            >
              Start Shopping <LuArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Items List */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4">Quantity</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Subtotal</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cartItems.map((item) => (
                    <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-gray-100">
                            <img src={item.image || "/box1.png"} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 w-fit p-1 rounded-xl shadow-sm">
                          <button
                            onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <LuMinus size={14} />
                          </button>
                          <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.qty || 1}</span>
                          <button
                            onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <LuPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-medium text-gray-600">₹{item.price?.toLocaleString() || 0}</td>
                      <td className="px-8 py-6 font-bold text-gray-900">₹{(item.price * (item.qty || 1)).toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-8 pt-8 border-t border-gray-100">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest"
              >
                Clear Shopping Cart
              </button>

              <div className="w-full md:w-80 space-y-6">
                <div className="flex justify-between items-center px-2">
                  <span className="text-gray-500 font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{totalPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-amber-500 hover:shadow-amber-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg"
                >
                  {placingOrder ? (
                    <LuLoaderCircle className="animate-spin" size={24} />
                  ) : (
                    <>Order Now <LuChevronRight size={22} /></>
                  )}
                </button>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Payment Processing</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
