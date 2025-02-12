import React, {useState} from 'react'

const PersonalSettings = ({ onBack }: any) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
    });
    const handleSubmit = (e: any) => {
      e.preventDefault();
      // Handle personal info update logic
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-lg"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Update Personal Information
        </button>
      </form>
    );
  };

  export default PersonalSettings