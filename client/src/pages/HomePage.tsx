import React, { useEffect, useState } from "react";
import SearchBar from "components/SearchBar";
import HeroSection from "components/home/HeroSection";
import EmployerSection from "components/home/EmployerSection";
import PartneredCompanies from "components/home/PartneredCompanies";
import BusinessGrowthSection from "components/home/BusinessGrowth";
import OneClickApplySection from "components/home/OneClickApply";
import Community from "components/home/Community";
import Footer from "components/Footer";

const HomePage = () => {

  return (
    <div className="w-full">
      <div className="text-center mb-14 mt-8">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Find Your Next Shift
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with employers who value local talent
        </p>
      </div>

      <SearchBar />

      <HeroSection />

      <OneClickApplySection />

      <Community />

      <PartneredCompanies />

      <EmployerSection />

      <BusinessGrowthSection />

      <Footer />
    </div>
  );
};
export default HomePage;
