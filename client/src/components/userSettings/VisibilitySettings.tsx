import React, {useState} from 'react'

const VisibilitySettings = ({ onBack }: any) => {
    const [visibility, setVisibility] = useState({
      profile: true,
      email: false,
      phone: false,
    });
    const handleSubmit = (e: any) => {
      e.preventDefault();
      // Handle visibility update logic
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Profile Visibility
            </label>
            <input
              type="checkbox"
              checked={visibility.profile}
              onChange={(e) =>
                setVisibility({
                  ...visibility,
                  profile: e.target.checked,
                })
              }
              className="h-4 w-4 text-teal-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Email Visibility
            </label>
            <input
              type="checkbox"
              checked={visibility.email}
              onChange={(e) =>
                setVisibility({
                  ...visibility,
                  email: e.target.checked,
                })
              }
              className="h-4 w-4 text-teal-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Phone Visibility
            </label>
            <input
              type="checkbox"
              checked={visibility.phone}
              onChange={(e) =>
                setVisibility({
                  ...visibility,
                  phone: e.target.checked,
                })
              }
              className="h-4 w-4 text-teal-600"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Update Visibility Settings
        </button>
      </form>
    );
  };

  export default VisibilitySettings