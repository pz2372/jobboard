import React, { useState } from "react";
import {
  Building2,
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  X,
} from "lucide-react";

type companyInfo = {
  name: string;
  location: string;
  website: string;
  description: string;
  email: string;
  phone: string;
};

const EmployerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalInfo, setOriginalInfo] = useState<companyInfo>({
    name: "",
    location: "",
    website: "",
    description: "",
    email: "",
    phone: "",
  });
  const [companyInfo, setCompanyInfo] = useState<companyInfo>({
    name: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    website: "techsolutions.com",
    description:
      "Tech Solutions Inc. is a leading software development company specializing in enterprise solutions, cloud computing, and artificial intelligence. With over 10 years of experience, we've helped hundreds of businesses transform their digital presence.",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
  });
  const handleEdit = () => {
    setOriginalInfo(companyInfo);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setCompanyInfo(originalInfo);
    setIsEditing(false);
  };
  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 p-6">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-lg rounded-full shadow-lg p-2 max-w-2xl w-full">
        <div className="flex justify-center px-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md">
            <Building2 size={20} />
            <span>Company</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-24">
        <header className="relative bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl shadow-xl p-12 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute bg-white/10 rounded-full blur-xl animate-float-${
                  i + 1
                }`}
                style={{
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 200 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-8 right-8 flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-white/20 rounded-full text-white transition-all duration-300 hover:bg-white/40 hover:shadow-lg hover:shadow-white/20"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 bg-white/20 rounded-full text-white transition-all duration-300 hover:bg-white/40 hover:shadow-lg hover:shadow-white/20"
                >
                  <Save size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Settings size={20} />
              </button>
            )}
          </div>

          <div className="relative flex items-center gap-8">
            <img
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623"
              alt="Company Logo"
              className="w-40 h-40 rounded-2xl object-cover shadow-lg ring-4 ring-white/20"
            />
            <div className="text-white">
              {isEditing ? (
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      name: e.target.value,
                    })
                  }
                  className="text-4xl font-bold mb-4 bg-white/20 hover:bg-white/30 rounded px-2 py-1 w-full transition-all duration-300 hover:scale-[1.02]"
                />
              ) : (
                <h1 className="text-4xl font-bold mb-4">{companyInfo.name}</h1>
              )}
              <div className="flex gap-6">
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyInfo.location}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          location: e.target.value,
                        })
                      }
                      className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-all duration-300 hover:scale-[1.02]"
                    />
                  ) : (
                    companyInfo.location
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <Globe size={18} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          website: e.target.value,
                        })
                      }
                      className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-all duration-300 hover:scale-[1.02]"
                    />
                  ) : (
                    companyInfo.website
                  )}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-teal-600">
                Company Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Description
                </label>
                {isEditing ? (
                  <textarea
                    value={companyInfo.description}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-300 hover:scale-[1.01]"
                    rows={4}
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {companyInfo.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Information
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    {isEditing ? (
                      <input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            email: e.target.value,
                          })
                        }
                        className="rounded border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-300 hover:scale-[1.02]"
                      />
                    ) : (
                      companyInfo.email
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={companyInfo.phone}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            phone: e.target.value,
                          })
                        }
                        className="rounded border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-300 hover:scale-[1.02]"
                      />
                    ) : (
                      companyInfo.phone
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployerProfile;
