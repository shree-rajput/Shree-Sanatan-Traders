import React, { useState, useEffect } from "react";
import {
  LuPlus,
  LuTrash2,
  LuMapPin,
  LuCheck,
  LuLoaderCircle,
  LuHouse,
} from "react-icons/lu";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl/mapbox";
import { Marker, NavigationControl } from "react-map-gl/mapbox";
import API from "../services/api";
import toast from "react-hot-toast";

const AddressManager = () => {
  const MP_CENTER = {
    latitude: 23.4733,
    longitude: 77.947,
  };

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [marker, setMarker] = useState(MP_CENTER);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  // if (!process.env.REACT_APP_MAPBOX_TOKEN) {
  //   return <div>Mapbox token missing</div>;
  // }

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "Madhya Pradesh",
    pincode: "",

    latitude: null,
    longitude: null,

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

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setMarker({
          latitude: lat,
          longitude: lng,
        });

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsLocationSelected(true);
        reverseGeocode(lat, lng);
      },
      () => {
        toast.error("Unable to get location");
      },
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      );

      const data = await res.json();

      const place = data.features?.[0];

      if (!place) return;

      const district =
        place.context?.find((x) => x.id.includes("district"))?.text || "";

      const region =
        place.context?.find((x) => x.id.includes("region"))?.text ||
        "Madhya Pradesh";

      const detectedPincode =
        place.context?.find((x) => x.id.includes("postcode"))?.text || "";

      setFormData((prev) => ({
        ...prev,
        city: district,
        state: region,
        pincode: detectedPincode,
      }));

      if (detectedPincode.length === 6) {
        fetchAddress(detectedPincode);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      if (!isPincodeVerified) {
        toast.error("Verify a valid pincode first.");
        return;
      }

      if (!isLocationSelected) {
        toast.error("Please select delivery location on map.");
        return;
      }

      await API.post("/addresses", {
        ...formData,
        coordinates: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      });
      toast.success("Address added!");

      resetForm();
      setShowAddModal(false);

      setFormData({
        fullName: "",
        mobileNumber: "",
        houseNo: "",
        area: "",
        landmark: "",
        city: "",
        state: "Madhya Pradesh",
        pincode: "",
        latitude: null,
        longitude: null,
        isDefault: false,
      });

      setMarker(MP_CENTER);
      setIsPincodeVerified(false);
      setIsLocationSelected(false);

      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      houseNo: "",
      area: "",
      landmark: "",
      city: "",
      state: "Madhya Pradesh",
      pincode: "",
      latitude: null,
      longitude: null,
      isDefault: false,
    });

    setMarker(MP_CENTER);
    setIsPincodeVerified(false);
    setIsLocationSelected(false);
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

  const fetchAddress = async (pincode) => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      const data = await res.json();

      if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          city: office.District,
          state: office.State,
        }));

        setIsPincodeVerified(true);
      } else {
        setIsPincodeVerified(false);

        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));

        toast.error("Please enter a valid pincode");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetchAddress(formData.pincode);
    }
  }, [formData.pincode]);

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

            {/* add current location */}
            <button
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:scale-[1.01]"
            >
              Use Current Location
            </button>
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              viewState={{
                latitude: marker.latitude,
                longitude: marker.longitude,
                zoom: 7,
              }}
              style={{
                width: "100%",
                height: 300,
                borderRadius: "20px",
              }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
            >
              <NavigationControl position="top-right" />

              <Marker
                latitude={marker.latitude}
                longitude={marker.longitude}
                draggable
                onDragEnd={(e) => {
                  const lat = e.lngLat.lat;
                  const lng = e.lngLat.lng;

                  setMarker({
                    latitude: lat,
                    longitude: lng,
                  });

                  setFormData((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                  }));
                  setIsLocationSelected(true);
                  reverseGeocode(lat, lng);
                }}
              />
            </Map>
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

                {/* PINCODE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Pincode
                  </label>

                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => {
                      const pin = e.target.value.replace(/\D/g, ""); // Only digits

                      setFormData((prev) => ({
                        ...prev,
                        pincode: pin,
                      }));

                      setIsPincodeVerified(false);
                    }}
                    className="w-full px-4 sm:px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm sm:text-base"
                  />
                  {formData.pincode.length === 6 && (
                    <div className="mt-2">
                      {isPincodeVerified ? (
                        <p className="text-green-600 text-sm font-semibold">
                          ✓ Pincode verified
                        </p>
                      ) : (
                        <p className="text-red-500 text-sm font-semibold">
                          ✗ Invalid pincode
                        </p>
                      )}
                    </div>
                  )}
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
                    readOnly
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
                    readOnly
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value,
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
                  readOnly={formData.isDefault}
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
                  disabled={!isPincodeVerified || !isLocationSelected}
                  className={`w-full sm:flex-1 px-6 py-3.5 rounded-2xl font-bold transition-all ${
                    isPincodeVerified && isLocationSelected
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:scale-[1.01]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
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
