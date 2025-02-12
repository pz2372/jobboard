import React, {useState} from 'react'

const PasswordSettings = ({ onBack }: any) => {
    const [formData, setFormData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const handleSubmit = (e: any) => {
      e.preventDefault();
      // Handle password update logic
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentPassword: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                newPassword: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Update Password
        </button>
      </form>
    );
  };

  export default PasswordSettings