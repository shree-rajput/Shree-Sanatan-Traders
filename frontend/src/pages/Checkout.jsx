import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  LuMapPin,
  LuCircleCheck,
  LuShoppingBag,
  LuChevronLeft,
  LuArrowRight,
  LuLoaderCircle,
  LuTruck,
  LuBanknote,
  LuCreditCard,
  LuPlus,
  LuTrash2,
  LuCheck,
  LuCircle,
} from "react-icons/lu";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Support "Buy Now" — location state may carry a single product
  const buyNowItem = location.state?.buyNowItem || null;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const checkoutTotal = buyNowItem
    ? buyNowItem.price * buyNowItem.qty
    : totalPrice;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = summary+pay
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    mobileNumber: user?.phone || "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const deliveryCharge = checkoutTotal >= 500 ? 0 : 40;
  const finalTotal = checkoutTotal + deliveryCharge;

  useEffect(() => {
    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/addresses");
      setAddresses(res.data);
      // Select default address if it exists
      const defaultAddr = res.data.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (res.data.length > 0) setSelectedAddress(res.data[0]);
    } catch (err) {
      toast.error("Failed to load your addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/addresses", newAddress);
      toast.success("Address added successfully!");
      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data);
      setShowAddModal(false);
      setNewAddress({
        fullName: user?.name || "",
        mobileNumber: user?.phone || "",
        houseNo: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const handleNextStep = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: checkoutItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price || item.variants?.[0]?.price || 0,
          quantity: item.qty || 1,
          image: item.image || item.images?.[0] || null,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          mobileNumber: selectedAddress.mobileNumber,
          houseNo: selectedAddress.houseNo,
          area: selectedAddress.area,
          landmark: selectedAddress.landmark,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        paymentMethod,
        totalPrice: checkoutTotal,
        deliveryCharge,
        totalAmount: finalTotal,
      };

      const res = await API.post("/orders", orderPayload);
      const order = res.data.order;

      if (!buyNowItem) clearCart();

      toast.success("🌾 Order placed successfully!", { duration: 4000 });
      navigate("/order-success", { state: { order }, replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("checkout_title")}
          </h1>
          <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm font-medium">
            {buyNowItem
              ? "Quick checkout for your selected item"
              : `${checkoutItems.length} items in your order`}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${step >= 1 ? "bg-green-600 text-white shadow-lg shadow-green-100 dark:shadow-green-900/20" : "bg-white dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800"}`}
            >
              <LuTruck size={16} /> {t("shipping_details")}
            </div>
            <div
              className={`w-10 h-0.5 rounded-full ${step >= 2 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-800"}`}
            />
            <div
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${step >= 2 ? "bg-green-600 text-white shadow-lg shadow-green-100 dark:shadow-green-900/20" : "bg-white dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800"}`}
            >
              <LuCreditCard size={16} /> {t("confirm_pay")}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* ===== STEP 1: Address Selection ===== */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
                    <LuMapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("shipping_details")}
                    </h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {t("delivery_address_prompt")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  <LuPlus size={18} /> Add New
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <LuLoaderCircle
                    className="animate-spin text-green-600 mb-4"
                    size={40}
                  />
                  <p className="text-gray-400 font-medium">
                    Fetching your addresses...
                  </p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 mb-8">
                  <LuMapPin
                    size={48}
                    className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No addresses found
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                    Please add a shipping address to continue with your order.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 mb-10">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddress?._id === addr._id
                          ? "border-green-500 bg-green-50/30 dark:bg-green-900/10"
                          : "border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {selectedAddress?._id === addr._id ? (
                            <LuCircleCheck
                              className="text-green-600"
                              size={20}
                            />
                          ) : (
                            <LuCircle
                              className="text-gray-300 dark:text-gray-700"
                              size={20}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-bold rounded uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {addr.houseNo}, {addr.area},{" "}
                            {addr.landmark && `${addr.landmark}, `}
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">
                            📞 {addr.mobileNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-8 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => navigate(buyNowItem ? -1 : "/cart")}
                  className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors"
                >
                  <LuChevronLeft size={20} />{" "}
                  {buyNowItem ? "Back" : t("return_to_cart")}
                </button>
                <button
                  disabled={!selectedAddress}
                  onClick={handleNextStep}
                  className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 dark:shadow-green-900/20 hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("continue_summary")} <LuArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Summary + Payment ===== */}
          {step === 2 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
                  <LuShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("order_summary")}
                  </h2>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("review_summary")}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-8">
                {checkoutItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image || item.images?.[0] || "/box1.png"}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Qty: {item.qty || 1}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-black text-white p-6 rounded-3xl mb-8 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest ">
                    Shipping to
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-white text-xs font-bold "
                  >
                    {t("edit_shipping")}
                  </button>
                </div>
                <p className="text-base text-black font-bold mb-1">
                  {selectedAddress?.fullName}
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {selectedAddress?.houseNo}, {selectedAddress?.area},{" "}
                  {selectedAddress?.landmark &&
                    `${selectedAddress?.landmark}, `}
                  {selectedAddress?.city}, {selectedAddress?.state} -{" "}
                  {selectedAddress?.pincode}
                </p>
                <p className="text-sm text-gray-800 mt-2 font-medium">
                  📞 {selectedAddress?.mobileNumber}
                </p>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-800 font-medium">
                      Subtotal
                    </span>
                    <span className="text-sm font-bold text-green-400">
                      ₹{checkoutTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-800 font-medium">
                      Delivery
                    </span>
                    <span
                      className={`text-sm font-bold ${deliveryCharge === 0 ? "text-green-400" : "text-gray-100"}`}
                    >
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                    <span className="text-lg font-bold text-black">
                      Total Payable
                    </span>
                    <span className="text-2xl font-bold text-green-400">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">
                  Select Payment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === "cod"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl ${paymentMethod === "cod" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}
                    >
                      <LuBanknote size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p
                        className={`text-sm font-bold ${paymentMethod === "cod" ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-400"}`}
                      >
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-gray-400">
                        Pay at your doorstep
                      </p>
                    </div>
                    {paymentMethod === "cod" && (
                      <LuCircleCheck className="text-green-600" size={20} />
                    )}
                  </button>

                  <button
                    disabled
                    className="p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 opacity-50 flex items-center gap-4 cursor-not-allowed"
                  >
                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
                      <LuCreditCard size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-gray-400">
                        Online Payment
                      </p>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-5 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors border-2 border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center gap-2"
                >
                  <LuChevronLeft size={20} /> {t("edit_shipping")}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="flex-1 py-5 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 dark:shadow-green-900/20 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {placingOrder ? (
                    <>
                      <LuLoaderCircle className="animate-spin" size={22} />{" "}
                      Placing Order...
                    </>
                  ) : (
                    <>
                      {t("place_order_btn")} <LuCircleCheck size={22} />
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                🔒 Safe & Secure Checkout Experience
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add Shipping Address
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <LuPlus className="rotate-45" size={24} />
              </button>
            </div>
            <form
              onSubmit={handleAddNewAddress}
              className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, fullName: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Mobile Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={newAddress.mobileNumber}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        mobileNumber: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    House/Flat No.
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.houseNo}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, houseNo: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Area/Street
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.area}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, area: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, landmark: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    State
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Pincode
                  </label>
                  <input
                    required
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 dark:shadow-green-900/20 hover:bg-green-700 transition-all"
                >
                  Save & Use
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
