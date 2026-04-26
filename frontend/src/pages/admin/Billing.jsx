import React, { useState, useEffect } from "react";
import API from "../../services/api";

import {
  LuSearch as Search,
  LuTrash2 as Trash2,
  LuPlus as Plus,
  LuMinus as Minus,
  LuUser as User,
  LuPhone as Phone,
  LuPrinter as Printer,
  LuCreditCard as CreditCard,
  LuHistory as History,
  LuShoppingCart as ShoppingCart
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminBilling = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Out of stock!");
        return;
      }
      setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock <= 0) {
        toast.error("Product unavailable");
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const product = products.find(p => p._id === id);
        const newQty = Math.max(1, item.quantity + change);
        if (newQty > product.stock) {
          toast.error("Stock limit reached");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.variants?.[0]?.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    setIsProcessing(true);
    try {
      const orderData = {
        customerName: customer.name,
        customerPhone: customer.phone,
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.variants?.[0]?.price
        })),
        totalPrice: calculateTotal(),
        isOffline: true
      };

      await API.post("/admin/orders", orderData);
      toast.success("Bill generated successfully!");
      setCart([]);
      setCustomer({ name: "", phone: "" });
      window.print(); // Mock printing
    } catch (err) {
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] animate-in fade-in duration-500">
        {/* Product Selection */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by product name or scan barcode..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <button
                  key={p._id}
                  onClick={() => addToCart(p)}
                  disabled={p.stock <= 0}
                  className={`p-4 rounded-2xl border border-gray-50 text-left transition-all hover:shadow-md hover:border-emerald-200 group flex flex-col ${p.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden">
                    <img src={p.images?.[0] || '/box1.png'} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight flex-1">{p.name}</h4>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-emerald-700 font-black">₹{p.variants?.[0]?.price}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-emerald-600'}`}>
                      {p.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart & Billing Detail */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Current Bill</h3>
              <button onClick={() => setCart([])} className="text-red-500 hover:text-red-600">
                <Trash2 size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-600"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl group">
                  <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0">
                    <img src={item.images?.[0] || '/box1.png'} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h5>
                    <p className="text-xs text-gray-500 font-bold">₹{item.variants?.[0]?.price} / unit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, -1)} className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-black text-gray-900 text-sm">₹{item.variants?.[0]?.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                  <ShoppingCart size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">Cart is empty</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center text-gray-500 font-bold">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 font-bold">
                <span>Tax (GST 0%)</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black text-gray-900">
                <span>Total</span>
                <span className="text-emerald-700">₹{calculateTotal()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  <Printer size={18} />
                  Hold
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-700 rounded-2xl font-black text-white shadow-lg shadow-green-100 hover:bg-green-800 transition-all disabled:opacity-50"
                >
                  <CreditCard size={18} />
                  {isProcessing ? "Processing..." : "Pay & Print"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default AdminBilling;