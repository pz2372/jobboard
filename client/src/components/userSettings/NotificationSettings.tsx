import React, { useState } from "react";

const NotificationSettings = ({ onBack }: any) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle notifications update logic
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                email: e.target.checked,
              })
            }
            className="h-4 w-4 text-teal-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Push Notifications
          </label>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                push: e.target.checked,
              })
            }
            className="h-4 w-4 text-teal-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            SMS Notifications
          </label>
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                sms: e.target.checked,
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
        Update Notification Settings
      </button>
    </form>
  );
};

export default NotificationSettings;
