import React from "react";
import { Coffee, Utensils, CreditCard } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="py-16 md:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile/Tablet Image (positioned as background) */}
        <div className="md:hidden w-full h-[500px] absolute top-0 mt-10 left-0 right-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
            alt="Students enjoying food at a restaurant"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-stretch relative">
          {/* Text Section - Overlay on mobile/tablet */}
          <div className="md:w-1/2 md:pr-12 flex flex-col justify-center z-20 p-6 md:p-0 bg-white/80 md:bg-transparent rounded-lg md:rounded-none">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Connecting <span className="text-[#3D9A8C]">Students</span>,{" "}
              <span className="text-[#4682B4]">Creators</span> &{" "}
              <span className="text-[#FF7E5F]">Restaurants</span>
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="bg-[#3D9A8C] p-2 rounded-full">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-gray-700">Content Creation</span>
              </div>
              <div className="flex items-center">
                <div className="bg-[#FF7E5F] p-2 rounded-full">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-gray-700">Local Restaurants</span>
              </div>
              <div className="flex items-center">
                <div className="bg-[#3D9A8C] p-2 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-gray-700">Exclusive Jobs</span>
              </div>
            </div>
          </div>
          {/* Desktop Image (visible only on md screens and up) */}
          <div className="hidden md:block md:w-1/2 relative h-[500px] flex items-center">
            <div className="w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Students enjoying food at a restaurant"
                className="rounded-lg shadow-xl relative z-10 object-cover w-full h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
