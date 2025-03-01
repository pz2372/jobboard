import React, { useState } from "react";

const LocationSettings = ({ onBack }: any) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle location update logic
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value,
            })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={formData.city}
          onChange={(e) =>
            setFormData({
              ...formData,
              city: e.target.value,
            })
          }
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
      >
        Update Location
      </button>
    </form>
  );
};

export default LocationSettings;
