import React from "react";
import {
  LuStore,
  LuSprout,
  LuGlobe,
  LuMapPin,
  LuBriefcase,
} from "react-icons/lu";

const BusinessDetails = ({ formData, setFormData, handleUpdate }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>

          <p className="text-gray-500 mt-1">
            Manage your agricultural or business information
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
          {formData.userType === "farmer" ? (
            <LuSprout size={28} />
          ) : (
            <LuStore size={28} />
          )}
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-6">
        {/* USER TYPE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Account Type
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["farmer", "retailer", "wholesaler", "other"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    userType: type,
                  })
                }
                className={`py-4 rounded-2xl border font-semibold capitalize transition ${
                  formData.userType === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* FARMER */}
        {formData.userType === "farmer" ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Land Size
              </label>

              <input
                type="text"
                value={formData.landSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    landSize: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Irrigation
              </label>

              <input
                type="text"
                value={formData.irrigation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    irrigation: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crops
              </label>

              <input
                type="text"
                value={formData.crops}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    crops: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Name
              </label>

              <input
                type="text"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shopName: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type
              </label>

              <input
                type="text"
                value={formData.businessType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessType: e.target.value,
                  })
                }
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website
              </label>

              <div className="relative">
                <LuGlobe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Address
              </label>

              <div className="relative">
                <LuMapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50"
                />
              </div>
            </div>
          </>
        )}

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition"
          >
            Save Business Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessDetails;
