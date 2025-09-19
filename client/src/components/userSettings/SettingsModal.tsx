import React, { useState } from "react";
import {
  Settings,
  Lock,
  MapPin,
  UserCircle,
  X,
  ChevronRight,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import LocationSettings from "./LocationSettings";
import NotificationSettings from "./NotificationSettings";
import PasswordSettings from "./PasswordSettings";
import PersonalSettings from "./PersonalSettings";
import VisibilitySettings from "./VisibilitySettings";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState("main");
  const dispatch = useDispatch();
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
      /*{
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
    },*/
    
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
              onClick={onClose}
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

        {currentView == "main" && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => dispatch(logout())}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
