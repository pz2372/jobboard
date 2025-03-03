import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import axiosInstance from "axiosInstance";

type companyInfo = {
  id: number;
  companyName: string;
  address: string;
  city: string;
  state: string;
  logo: string;
  EIN: number;
  website: string;
  description: string;
  email: string;
  phoneNumber: string;
};

const CompanyPage = () => {
  const [companyInfo, setCompanyInfo] = useState<Partial<companyInfo>>({});
  const { employerId } = useParams();

  useEffect(() => {
    axiosInstance
      .get(`/employer/${employerId}`)
      .then((response) => {
        setCompanyInfo(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
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

        <div className="relative flex items-center gap-8">
          <img
            src={companyInfo.logo ? companyInfo.logo : "https://images.unsplash.com/photo-1560179707-f14e90ef3623"}
            alt="Company Logo"
            className="w-40 h-40 rounded-2xl object-cover shadow-lg ring-4 ring-white/20"
          />
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">{companyInfo.companyName}</h1>

            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <MapPin size={18} />
                {companyInfo.city}, {companyInfo.state}
              </span>
              <span className="flex items-center gap-2">
                <Globe size={18} />
                {companyInfo.website}
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
                {companyInfo.description}
              </label>

              <p className="mt-1 text-gray-600">{companyInfo.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  {companyInfo.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  {companyInfo.phoneNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
