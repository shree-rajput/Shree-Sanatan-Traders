// import React, { useState, useEffect } from "react";
// import {
//   LuPlus,
//   LuTrash2,
//   LuMapPin,
//   LuCheck,
//   LuLoaderCircle,
//  LuHouse,
//   LuBriefcase,
// } from "react-icons/lu";
// import API from "../services/api";
// import toast from "react-hot-toast";

// const AddressManager = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobileNumber: "",
//     houseNo: "",
//     area: "",
//     landmark: "",
//     city: "",
//     state: "",
//     pincode: "",
//     isDefault: false,
//   });

//   const fetchAddresses = async () => {
//     try {
//       const res = await API.get("/addresses");
//       setAddresses(res.data);
//     } catch (err) {
//       toast.error("Failed to load addresses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/addresses", formData);
//       toast.success("Address added!");
//       setShowAddModal(false);
//       setFormData({
//         fullName: "",
//         mobileNumber: "",
//         houseNo: "",
//         area: "",
//         landmark: "",
//         city: "",
//         state: "",
//         pincode: "",
//         isDefault: false,
//       });
//       fetchAddresses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add address");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this address?")) return;
//     try {
//       await API.delete(`/addresses/${id}`);
//       toast.success("Address deleted");
//       fetchAddresses();
//     } catch (err) {
//       toast.error("Failed to delete address");
//     }
//   };

//   const handleSetDefault = async (id) => {
//     try {
//       await API.patch(`/addresses/${id}/default`);
//       toast.success("Default address updated");
//       fetchAddresses();
//     } catch (err) {
//       toast.error("Failed to update default address");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center p-12">
//         <LuLoaderCircle className="animate-spin text-green-600" size={32} />
//       </div>
//     );

//   return (
//     <div className="space-y-6 h-[400px] overflow-y-auto">
//       <div className="flex items-center justify-between mb-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Saved Addresses
//         </h3>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 dark:shadow-green-900/20 hover:bg-green-700 transition-all"
//         >
//           <LuPlus size={18} />
//           Add New
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {addresses.length === 0 ? (
//           <div className="md:col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
//             <LuMapPin
//               size={40}
//               className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
//             />
//             <p className="text-gray-500 dark:text-gray-400 font-medium">
//               No saved addresses yet
//             </p>
//           </div>
//         ) : (
//           addresses.map((addr) => (
//             <div
//               key={addr._id}
//               className={`relative p-6 rounded-2xl border transition-all ${
//                 addr.isDefault
//                   ? "border-green-500 bg-green-50/30 dark:bg-green-900/10 ring-1 ring-green-500"
//                   : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-green-200 dark:hover:border-green-900"
//               }`}
//             >
//               {addr.isDefault && (
//                 <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
//                   <LuCheck size={12} />
//                   Default
//                 </div>
//               )}

//               <div className="flex items-start gap-4">
//                 <div
//                   className={`p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600`}
//                 >
//                   <LuMapPin size={20} />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900 dark:text-white capitalize mb-1">
//                     {addr.fullName}
//                   </h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
//                     {addr.houseNo}, {addr.area}
//                     <br />
//                     {addr.landmark && (
//                       <>
//                         {addr.landmark}
//                         <br />
//                       </>
//                     )}
//                     {addr.city}, {addr.state} - {addr.pincode}
//                     <br />
//                     📞 {addr.mobileNumber}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   {!addr.isDefault && (
//                     <button
//                       onClick={() => handleSetDefault(addr._id)}
//                       className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider"
//                     >
//                       Set Default
//                     </button>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => handleDelete(addr._id)}
//                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
//                 >
//                   <LuTrash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Add Address Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 h-[400px] w-full mt-8">
//           <div
//             className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
//             onClick={() => setShowAddModal(false)}
//           ></div>
//           <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 mt-8">
//             <div className="p-8 border-b border-gray-100 dark:border-gray-800">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 Add New Address
//               </h3>
//             </div>
//             <form onSubmit={handleAddAddress} className="p-8 space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="col-span-2 space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     Full Name
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) =>
//                       setFormData({ ...formData, fullName: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="col-span-2 space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     Mobile Number
//                   </label>
//                   <input
//                     required
//                     type="tel"
//                     value={formData.mobileNumber}
//                     onChange={(e) =>
//                       setFormData({ ...formData, mobileNumber: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     House/Flat No.
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.houseNo}
//                     onChange={(e) =>
//                       setFormData({ ...formData, houseNo: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     Area/Street
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.area}
//                     onChange={(e) =>
//                       setFormData({ ...formData, area: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="col-span-2 space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     Landmark (Optional)
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.landmark}
//                     onChange={(e) =>
//                       setFormData({ ...formData, landmark: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     City
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) =>
//                       setFormData({ ...formData, city: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     State
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.state}
//                     onChange={(e) =>
//                       setFormData({ ...formData, state: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
//                     Pincode
//                   </label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.pincode}
//                     onChange={(e) =>
//                       setFormData({ ...formData, pincode: e.target.value })
//                     }
//                     className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-green-500 outline-none transition-all dark:text-white"
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="isDefault"
//                   checked={formData.isDefault}
//                   onChange={(e) =>
//                     setFormData({ ...formData, isDefault: e.target.checked })
//                   }
//                   className="w-5 h-5 accent-green-600 rounded-lg"
//                 />
//                 <label
//                   htmlFor="isDefault"
//                   className="text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer"
//                 >
//                   Set as default address
//                 </label>
//               </div>
//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 dark:shadow-green-900/20 hover:bg-green-700 transition-all"
//                 >
//                   Save Address
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddressManager;

import React, { useState, useEffect } from "react";
import {
  LuPlus,
  LuTrash2,
  LuMapPin,
  LuCheck,
  LuLoaderCircle,
  LuHouse,
} from "react-icons/lu";

import API from "../services/api";
import toast from "react-hot-toast";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses");
      setAddresses(res.data);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      await API.post("/addresses", formData);

      toast.success("Address added!");

      setShowAddModal(false);

      setFormData({
        fullName: "",
        mobileNumber: "",
        houseNo: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });

      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await API.delete(`/addresses/${id}`);

      toast.success("Address deleted");

      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await API.patch(`/addresses/${id}/default`);

      toast.success("Default address updated");

      fetchAddresses();
    } catch (err) {
      toast.error("Failed to update default address");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <LuLoaderCircle className="animate-spin text-green-600" size={34} />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Saved Addresses</h3>

          <p className="text-sm text-gray-500 mt-1">
            Manage your delivery addresses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all duration-200"
        >
          <LuPlus size={18} />
          Add New
        </button>
      </div>

      {/* ADDRESS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <LuMapPin size={28} className="text-green-600" />
            </div>

            <h4 className="text-lg font-bold text-gray-900 mb-1">
              No Saved Addresses
            </h4>

            <p className="text-gray-500">Add your first delivery address</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`relative p-6 rounded-3xl border bg-white transition-all duration-300 hover:shadow-xl ${
                addr.isDefault
                  ? "border-green-500 shadow-lg shadow-green-100"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              {/* DEFAULT BADGE */}
              {addr.isDefault && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                  <LuCheck size={12} />
                  Default
                </div>
              )}

              {/* CONTENT */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-green-50 text-green-600 border border-green-100 shrink-0">
                  <LuHouse size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg text-gray-900 capitalize mb-2">
                    {addr.fullName}
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed break-words">
                    {addr.houseNo}, {addr.area}
                    <br />
                    {addr.landmark && (
                      <>
                        {addr.landmark}
                        <br />
                      </>
                    )}
                    {addr.city}, {addr.state} - {addr.pincode}
                    <br />
                    <span className="font-semibold text-gray-700">
                      📞 {addr.mobileNumber}
                    </span>
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-sm font-bold text-green-600 hover:text-green-700 transition-all"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* MODAL */}
          <div className="relative w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
            {/* HEADER */}
            <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                    Add New Address
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Enter your delivery details below
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleAddAddress}
              className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* FULL NAME */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* MOBILE */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Mobile Number
                  </label>

                  <input
                    required
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobileNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* HOUSE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    House / Flat No.
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.houseNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        houseNo: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* AREA */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Area / Street
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        area: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* LANDMARK */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Landmark
                  </label>

                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landmark: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* CITY */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    City
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* STATE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    State
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* PINCODE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Pincode
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pincode: e.target.value,
                      })
                    }
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* CHECKBOX */}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-6">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isDefault: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-green-600 rounded-lg shrink-0"
                />

                <label
                  htmlFor="isDefault"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Set as default address
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 sticky bottom-0 bg-white mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:scale-[1.01] transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
