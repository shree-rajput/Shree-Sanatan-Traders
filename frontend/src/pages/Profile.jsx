import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Package,
  LogOut,
  ChevronRight,
  Loader2,
  ArrowLeft,
  MapPinned,
  Truck,
  CheckCircle2,
  Edit2,
  X
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import { translations } from "../utils/translations";

const Profile = ({ lang, setLang }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang] || translations["hi"];

  // View state: DASHBOARD | EDIT_PROFILE | ADD_ADDRESS
  const [view, setView] = useState("DASHBOARD");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [villageList, setVillageList] = useState([]);
  const [manualVillage, setManualVillage] = useState(false);
  const [autofilledFields, setAutofilledFields] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        village: user.village || user.address || "",
        district: user.district || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
      setLoading(false);
    }
  }, [user]);

  // --- ACTIONS ---
  const handleUpdate = async () => {
    if (!formData.name || !formData.phone) return showMsg("error", "Name & Phone are required");
    if (!formData.district || !formData.state) return showMsg("error", "District & State are required");

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        "/users/me",
        { ...formData, address: formData.village },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      login(res.data, token);
      setView("DASHBOARD");
      showMsg("success", "Profile Updated ✅");
    } catch (err) {
      showMsg("error", "Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return showMsg("error", "GPS not supported");
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            village: addr.village || addr.town || addr.city || addr.hamlet || prev.village,
            pincode: addr.postcode || prev.pincode,
            district: addr.state_district || addr.county || prev.district,
            state: addr.state || prev.state
          }));

          setAutofilledFields(['village', 'pincode', 'district', 'state']);
          showMsg("success", "Location detected ✅");
        } catch (err) {
          showMsg("error", "Detection failed");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        showMsg("error", "Permission denied");
      }
    );
  };

  const handlePincodeChange = async (val) => {
    if (!/^\d*$/.test(val)) return;
    setFormData((prev) => ({ ...prev, pincode: val }));
    setAutofilledFields(prev => prev.filter(f => f !== 'pincode'));

    if (val.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();

        if (data[0]?.Status === "Success") {
          const postOffices = data[0].PostOffice || [];
          const info = postOffices[0];

          setFormData(prev => ({
            ...prev,
            district: info.District,
            state: info.State
          }));

          setVillageList(postOffices.map(po => po.Name));
          setAutofilledFields(prev => [...new Set([...prev, 'district', 'state', 'village'])]);
          showMsg("success", "Auto-filled from pincode ✅");
        } else {
          showMsg("error", "Invalid pincode");
          setVillageList([]);
        }
      } catch (err) {
        showMsg("error", "Network error");
        setVillageList([]);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setVillageList([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  // --- SUB-COMPONENTS ---

  const Header = ({ title, showBack = false }) => (
    <div className="bg-white px-4 py-4 flex items-center border-b sticky top-0 z-10">
      {showBack && (
        <button onClick={() => setView("DASHBOARD")} className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
      )}
      <h1 className="text-lg font-semibold text-gray-800">{String(title).toUpperCase()}</h1>
    </div>
  );

  const InfoTag = ({ icon: Icon, text, subtext, color = "emerald" }) => (
    <div className={`p-4 bg-${color}-50 rounded-2xl flex items-start gap-4 border border-${color}-100`}>
      <div className={`p-2 bg-${color}-100 rounded-xl text-${color}-600`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className={`text-sm font-semibold text-${color}-800 leading-tight`}>{text}</h4>
        {subtext && <p className={`text-xs text-${color}-600/80 mt-0.5`}>{subtext}</p>}
      </div>
    </div>
  );

  // --- MAIN VIEWS ---

  if (view === "EDIT_PROFILE" || view === "ADD_ADDRESS") {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title={view === "EDIT_PROFILE" ? "Edit Profile" : "Delivery Address"} showBack />

        <div className="max-w-md mx-auto p-4 space-y-6">
          {view === "EDIT_PROFILE" ? (
            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  readOnly
                  className="w-full mt-1.5 p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  placeholder="Phone number"
                />
                <p className="text-[10px] text-gray-400 mt-1 ml-1">Phone number cannot be changed</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleDetectLocation}
                disabled={locationLoading}
                className="w-full py-4 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                {locationLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPinned size={20} />}
                {locationLoading ? "Detecting..." : "Use My Current Location"}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-300">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Pincode</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="6"
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      placeholder="6 Digit PIN Code"
                    />
                    {pincodeLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-600" size={20} />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">District</label>
                    <input
                      value={formData.district}
                      onChange={(e) => {
                        setFormData({ ...formData, district: e.target.value });
                        setAutofilledFields(prev => prev.filter(f => f !== 'district'));
                      }}
                      className={`w-full mt-1.5 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${autofilledFields.includes('district') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'
                        }`}
                      placeholder="District"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">State</label>
                    <input
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value });
                        setAutofilledFields(prev => prev.filter(f => f !== 'state'));
                      }}
                      className={`w-full mt-1.5 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${autofilledFields.includes('state') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'
                        }`}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Village / Area</label>
                  {!manualVillage && villageList.length > 0 ? (
                    <div className="space-y-2">
                      <select
                        value={formData.village}
                        onChange={(e) => {
                          setFormData({ ...formData, village: e.target.value });
                          setAutofilledFields(prev => prev.filter(f => f !== 'village'));
                        }}
                        className={`w-full mt-1.5 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none ${autofilledFields.includes('village') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'
                          }`}
                      >
                        <option value="">Select Village</option>
                        {villageList.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <button
                        onClick={() => setManualVillage(true)}
                        className="text-emerald-600 text-[11px] font-bold ml-1 uppercase"
                      >
                        My village is not listed
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => {
                        setFormData({ ...formData, village: e.target.value });
                        setAutofilledFields(prev => prev.filter(f => f !== 'village'));
                      }}
                      className={`w-full mt-1.5 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${autofilledFields.includes('village') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50'
                        }`}
                      placeholder="Enter Village Name"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            {updating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {updating ? "Saving Changes..." : "Save details"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="My Account" />

      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* User Card */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">{formData.name || "Farmer Ji"}</h2>
              <p className="text-gray-500 text-sm font-medium">{formData.phone}</p>
            </div>
          </div>
          <button
            onClick={() => setView("EDIT_PROFILE")}
            className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <Edit2 size={18} />
          </button>
        </div>

        {/* Address Card */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Delivery Address</h3>
            {formData.village && (
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase">Active</span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              {formData.village ? (
                <div className="text-gray-700">
                  <p className="font-semibold text-base">{formData.village}</p>
                  <p className="text-sm font-medium text-gray-500">{formData.district}, {formData.state} - {formData.pincode}</p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No address added yet</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setView("ADD_ADDRESS")}
            className="w-full mt-2 py-3 bg-gray-50 text-emerald-600 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors"
          >
            {formData.village ? "Change Address" : "Add Address"}
          </button>
        </div>

        {/* Info Card */}
        <div className="space-y-3">
          <InfoTag
            icon={Truck}
            text="Fast Delivery in 1-2 Days"
            subtext="Quick delivery to your village doorstep"
          />
          <InfoTag
            icon={MapPinned}
            text={`Delivering in all areas`}
            subtext="Local service for local farmers"
            color="orange"
          />
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <button
            onClick={() => navigate("/orders")}
            className="w-full p-4 flex items-center justify-between text-gray-700 bg-gray-50 active:bg-gray-100 transition-colors border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Package className="text-emerald-500" size={20} />
              <span className="font-semibold">My Orders</span>
            </div>
            <ChevronRight className="text-gray-300" size={20} />
          </button>
        </div>

        {/* Delivering To Highlight (Bonus) */}
        {formData.village && (
          <div className="bg-emerald-600/5 border border-emerald-600/10 p-3 rounded-xl flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs font-bold text-emerald-700">
              Delivering to: <span className="underline decoration-wavy decoration-emerald-300 underline-offset-4">{formData.village}</span>
            </p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 p-4 text-red-500 font-bold text-center bg-red-50 rounded-2xl transition-colors border border-transparent"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={20} />
            Logout
          </div>
        </button>

      </div>

      {/* Global Toast */}
      {message.text && (
        <div className="fixed bottom-24 left-4 right-4 z-50">
          <div className={`flex items-center gap-2 p-4 rounded-2xl shadow-xl border animate-in slide-in-from-bottom duration-300 ${message.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-red-600 border-red-500 text-white"
            }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <X size={20} />}
            <span className="font-bold text-sm">{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;