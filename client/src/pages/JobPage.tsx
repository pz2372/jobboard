import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  Sparkles,
  Building2,
  Send,
  UserCircle,
  BriefcaseIcon,
  Rocket,
  Star,
  SlidersHorizontal,
  X,
  Lock,
  Users,
  MessageCircle,
  Network,
  Globe2,
} from "lucide-react";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

const JobPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const jobs = [
    {
      title: "Retail Associate",
      company: "Local Bookstore",
      location: "San Francisco, CA",
      salary: "$15-18/hr",
      type: "Part-time",
      logoLetter: "L",
    },
    {
      title: "Junior Barista",
      company: "Coffee House",
      location: "Seattle, WA",
      salary: "$16-20/hr",
      type: "Weekend",
      logoLetter: "C",
    },
    {
      title: "Movie Theater Staff",
      company: "Cinema Plus",
      location: "Chicago, IL",
      salary: "$14-16/hr",
      type: "Flexible",
      logoLetter: "C",
    },
    {
      title: "Library Assistant",
      company: "Public Library",
      location: "Boston, MA",
      salary: "$15-17/hr",
      type: "After School",
      logoLetter: "P",
    },
    {
      title: "Restaurant Host",
      company: "Family Diner",
      location: "Austin, TX",
      salary: "$13-15/hr",
      type: "Evening",
      logoLetter: "F",
    },
    {
      title: "Grocery Store Clerk",
      company: "Fresh Market",
      location: "Portland, OR",
      salary: "$15-19/hr",
      type: "Part-time",
      logoLetter: "F",
    },
    {
      title: "Ice Cream Server",
      company: "Sweet Treats",
      location: "Miami, FL",
      salary: "$14-16/hr",
      type: "Summer",
      logoLetter: "S",
    },
    {
      title: "Pet Store Associate",
      company: "Happy Pets",
      location: "Denver, CO",
      salary: "$16-18/hr",
      type: "Weekend",
      logoLetter: "H",
    },
  ];
  return (
    <>
      <div className="relative">
        <SearchBar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {jobs.map((job, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 ${
                index >= 4 ? "opacity-50 blur-sm pointer-events-none" : ""
              }`}
            >
              <div className="flex gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-xl`}
                >
                  {job.logoLetter}
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-teal-600">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <span className="bg-teal-50 text-teal-600 text-sm px-4 py-1.5 rounded-full font-medium flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{job.location}</span>
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-teal-50 text-teal-600 px-4 py-3 rounded-xl hover:bg-teal-100 transition-all duration-300 font-medium flex items-center justify-center gap-2">
                  Apply Now
                  <Send className="w-4 h-4" />
                </button>
                <button className="px-4 py-3 rounded-xl border-2 border-teal-600 text-teal-600 hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMjggNjZMMCA1MEwyOCAzNGwyOCAxNkwyOCA2NnpNMjggMzRMMCA1MGwyOCAxNiAyOC0xNkwyOCAzNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white font-comic">
            Join For More Opportunities
          </h2>
          <p className="text-teal-50 mb-8 text-lg max-w-2xl mx-auto">
            Connect with fellow job seekers, share experiences, and get insider
            tips from industry professionals
          </p>
          <button className="bg-white text-teal-600 px-10 py-4 rounded-full hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 mx-auto flex items-center gap-2 font-semibold shadow-lg">
            Join Now
          </button>
        </div>
      </div>
    </>
  );
};

export default JobPage;
