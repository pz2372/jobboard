import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import axiosInstance from "axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import { toggleFilterOpen } from "../redux/filterSlice";
import { setSearchParams as setSearchState } from "../redux/searchSlice";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get search state from Redux
  const searchState = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();
  
  // Use Redux state or URL params (URL takes precedence on initial load)
  const searchQuery = searchParams.get("searchQuery") || searchState.searchQuery;
  const searchLocation = searchParams.get("searchLocation") || searchState.searchLocation;

  // List of cities for the dropdown
  const cities = ["Raleigh"];

  const location = useLocation();
  const navigate = useNavigate();
  const isFilterOpen = useSelector(
    (state: RootState) => state.filter.isFilterOpen
  );
  const filters = useSelector((state: RootState) => state.filter.filters);

  const page = location.pathname;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: string) => {
    // Update Redux state
    dispatch(setSearchState({ searchLocation: city }));
    setIsLocationDropdownOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    // Update Redux state with current search values
    dispatch(setSearchState({
      searchQuery,
      searchLocation,
    }));

    // Add search query and location
    searchQuery
      ? params.set("searchQuery", searchQuery)
      : params.delete("searchQuery");
    searchLocation
      ? params.set("searchLocation", searchLocation)
      : params.delete("searchLocation");

    // Add filters
    if (filters.jobType.length > 0) {
      params.set("jobType", filters.jobType.join(","));
    } else {
      params.delete("jobType");
    }

    if (filters.minWage) {
      params.set("minWage", filters.minWage);
    } else {
      params.delete("minWage");
    }

    if (filters.maxWage) {
      params.set("maxWage", filters.maxWage);
    } else {
      params.delete("maxWage");
    }

    if (filters.location.length > 0) {
      params.set("location", filters.location.join(","));
    } else {
      params.delete("location");
    }

    if (filters.experience.length > 0) {
      params.set("experience", filters.experience.join(","));
    } else {
      params.delete("experience");
    }
    
    // Navigate to jobs page with search parameters
    if (location.pathname === "/jobs") {
      setSearchParams(params);
    } else {
      navigate(`/jobs?${params.toString()}`, { replace: true });
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-lg p-7 mb-3 hover:shadow-xl transition-all duration-300 transform">
        <div className="flex flex-row gap-4">
          {/*<div className="flex-1 relative group">
            <Search className="absolute left-4 top-3 text-teal-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Find a shift"
              className="w-full px-12 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>*/}
          <div className="flex-1 relative group" ref={dropdownRef}>
            <MapPin className="absolute left-4 top-3 text-teal-600 w-5 h-5 z-10" />
            <div
              className="w-full px-12 py-2 border-2 border-gray-200 rounded-full focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent text-lg cursor-pointer bg-white flex items-center justify-between"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            >
              <span
                className={searchLocation ? "text-gray-900" : "text-gray-500"}
              >
                {searchLocation || "What city are you in?"}
              </span>
            </div>

            {/* Dropdown Menu */}
            {isLocationDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto z-1">
                <div className="p-2">
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer rounded-lg transition-colors duration-150"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/**page === "/jobs" && (
            <button
              onClick={() => dispatch(toggleFilterOpen())}
              className={`px-6 py-3 rounded-full border-2 ${
                isFilterOpen ? "bg-teal-50 border-teal-600" : "border-teal-600"
              } text-teal-600 hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          )**/}

          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-10 py-2 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            Search <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SearchFilters
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={() => dispatch(toggleFilterOpen())}
      />
    </div>
  );
};

export default SearchBar;
