import React, { Component } from 'react'
import AmazonLogo from "../../images/amazon.png";
import HarrisLogo from "../..//images/harris.png";
import McDonaldsLogo from "../../images/mcdonalds.png";
import NikeLogo from "../../images/nike.png";
import WalmartLogo from "../../images/walmart.png";

const PartneredCompanies = () => {
const partners = [
    {
      name: 'Amazon',
      logo: AmazonLogo,
      description: '',
      color: '#3D9A8C',
    },
    {
      name: 'Nike',
      logo: NikeLogo,
      description: '',
      color: '#FF7E5F',
    },
    {
      name: 'McDonalds',
      logo: McDonaldsLogo,
      description: '',
      color: '#4CAF50',
    },
    {
      name: 'Harris Teeter',
      logo: HarrisLogo,
      description: '',
      color: '#9C27B0',
    },
    {
      name: 'Walmart',
      logo: WalmartLogo,
      description: '',
      color: '#FF9800',
    },
  ]
  return (
    <div className="py-20 rounded-2xl bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#3D9A8C]">Partnered</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-[#e8f5f3] -z-10"></span>
            </span>{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FF7E5F]">Companies</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-[#fff5f2] -z-10"></span>
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            We work with the best companies in the food and content creation
            industry to provide you with the best experience.
          </p>
        </div>
        <div className="mt-16">
          {/* Marquee-style scrolling partners on mobile */}
          <div className="md:hidden overflow-hidden relative">
            <div className="flex space-x-6 py-4 animate-marquee">
              {[...partners, ...partners].map((partner, index) => (
                <PartnerCard key={`mobile-${index}`} partner={partner} />
              ))}
            </div>
          </div>
          {/* Desktop hexagon grid layout */}
          <div className="hidden md:block">
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-3 gap-x-12 gap-y-16">
                {/* First row */}
                <div className="col-span-1">
                  <PartnerCard partner={partners[0]} featured />
                </div>
                <div className="col-span-1">
                  <PartnerCard partner={partners[1]} featured />
                </div>
                <div className="col-span-1">
                  <PartnerCard partner={partners[2]} featured />
                </div>
                {/* Second row - offset */}
                <div className="col-span-1 col-start-1 col-end-2 translate-x-1/2">
                  <PartnerCard partner={partners[3]} featured />
                </div>
                <div className="col-span-1 col-start-2 col-end-3 translate-x-1/2">
                  <PartnerCard partner={partners[4]} featured />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24 bg-gradient-to-r from-[#e8f5f3] to-[#fff5f2] rounded-xl p-8 shadow-lg relative overflow-hidden group transition-all duration-300">
          {/* Decorative elements */}
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900">
                Become a Partner
              </h3>
              <p className="mt-2 text-gray-600">
                Join our growing network of restaurants, delivery services, and
                content creation platforms. Expand your reach and connect with
                our community of students and food enthusiasts.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-[#3D9A8C] to-[#FF7E5F] hover:from-[#348c7e] hover:to-[#e56e53] shadow-md hover:shadow-lg duration-300 font-medium hover:scale-105">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          min-width: 200%;
        }
      `}</style>
    </div>
  )
}
// Partner Card Component
const PartnerCard = ({ partner, featured = false }) => {
  return (
    <div
      className={`group flex flex-col items-center ${featured ? 'transform transition-transform duration-300 hover:scale-105' : ''}`}
    >
      <div className="relative">
        {/* Hexagon Shape with Gradient Border */}
        <div
          className="h-32 w-32 relative"
          style={{
            clipPath:
              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: `linear-gradient(45deg, ${partner.color}80, white)`,
          }}
        >
          {/* Inner hexagon for content */}
          <div
            className="absolute inset-1 flex items-center justify-center bg-white group-hover:bg-gray-50 transition-colors duration-300"
            style={{
              clipPath:
                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-20 w-20 object-cover rounded-full p-1 transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
        
      </div>
    </div>
  )
}
export default PartneredCompanies
