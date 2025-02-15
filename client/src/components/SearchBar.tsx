import React from "react";
import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, X, DollarSign } from "lucide-react";
import { useLocation } from "react-router-dom";
import SearchFilters from "./SearchFilters";

const SearchBar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="text"
              placeholder="What's your dream job?"
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>
          <div className="flex-1 relative group">
            <MapPin className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Where would you like to work?"
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>

          {location.pathname == "/jobs" && (
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-6 py-3 rounded-full border-2 ${
                isFilterOpen ? "bg-teal-50 border-teal-600" : "border-teal-600"
              } text-teal-600 hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          )}

          <button className="bg-teal-600 text-white px-10 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            Search <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SearchFilters isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}/>
    </div>
  );
};

export default SearchBar;
