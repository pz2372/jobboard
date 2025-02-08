import React, { useState } from "react";
import {
  Settings,
  Lock,
  MapPin,
  UserCircle,
  Eye,
  Bell,
  X,
  ChevronRight,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const PasswordSettings = ({ onBack }: any) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
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

const LocationSettings = ({ onBack }: any) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const handleSubmit = (e) => {
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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={formData.country}
          onChange={(e) =>
            setFormData({
              ...formData,
              country: e.target.value,
            })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Postal Code
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({
              ...formData,
              postalCode: e.target.value,
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

const PersonalSettings = ({ onBack }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const handleSubmit = (e) => {
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

const VisibilitySettings = ({ onBack }: any) => {
  const [visibility, setVisibility] = useState({
    profile: true,
    email: false,
    phone: false,
  });
  const handleSubmit = (e) => {
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

const NotificationSettings = ({ onBack }: any) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const handleSubmit = (e) => {
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

const SettingsModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentView, setCurrentView] = useState("main");
  const menuItems = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Change Password",
      description: "Update your password",
      view: "password",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location",
      description: "Update your location",
      view: "location",
    },
    {
      icon: <UserCircle className="w-5 h-5" />,
      title: "Personal Information",
      description: "Update your personal details",
      view: "personal",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Profile Visibility",
      description: "Manage who can see your profile",
      view: "visibility",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Choose what updates you receive",
      view: "notifications",
    },
  ];
  const renderView = () => {
    switch (currentView) {
      case "password":
        return <PasswordSettings onBack={() => setCurrentView("main")} />;
      case "location":
        return <LocationSettings onBack={() => setCurrentView("main")} />;
      case "personal":
        return <PersonalSettings onBack={() => setCurrentView("main")} />;
      case "visibility":
        return <VisibilitySettings onBack={() => setCurrentView("main")} />;
      case "notifications":
        return <NotificationSettings onBack={() => setCurrentView("main")} />;
      default:
        return null;
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView !== "main" && (
                <button
                  onClick={() => setCurrentView("main")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <Settings className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-semibold text-teal-600">Settings</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {currentView === "main"
            ? menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-teal-50 transition-colors group"
                  onClick={() => setCurrentView(item.view)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-teal-50 text-teal-600 group-hover:bg-white">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                </button>
              ))
            : renderView()}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
