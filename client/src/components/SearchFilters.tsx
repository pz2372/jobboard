import { DollarSign, X } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import { updateJobType, updateMinWage, updateMaxWage, updateLocation, updateExperience, clearAllFilters, toggleFilterOpen } from "../redux/filterSlice";

type SearchFiltersProps = {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter.filters);

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
  };

  const handleClose = () => {
    dispatch(toggleFilterOpen());
    setIsFilterOpen(false);
  };

  return (
    <div
      className={`absolute w-full bg-white rounded-3xl shadow-xl p-6 z-20 transition-all duration-300 ${
        isFilterOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-teal-600">Filters</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-3 mx-auto">
          <label className="font-medium text-gray-700 block">Job Type</label>
          {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
            <label key={type} className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={filters.jobType.includes(type)}
                onChange={() => dispatch(updateJobType(type))}
              />
              {type}
            </label>
          ))}
        </div>

        <div className="space-y-3 mx-auto">
          <label className="font-medium text-center text-gray-700 block">
            Hourly Wage Range ($)
          </label>
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
              <input
                type="number"
                min="0"
                step="0.50"
                placeholder="Min"
                className="w-full max-w-40 px-8 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                value={filters.minWage}
                onChange={(e) => dispatch(updateMinWage(e.target.value))}
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 text-teal-600 w-5 h-5" />
              <input
                type="number"
                min="0"
                step="0.50"
                placeholder="Max"
                className="w-full max-w-40 px-8 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
                value={filters.maxWage}
                onChange={(e) => dispatch(updateMaxWage(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 mx-auto">
          <label className="font-medium text-gray-700 block">
            Experience Level
          </label>
          {["Entry Level", "Junior", "Mid Level", "Senior"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 text-gray-600"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={filters.experience.includes(level)}
                onChange={() => dispatch(updateExperience(level))}
              />
              {level}
            </label>
          ))}
        </div>

        <div className="space-y-3 mx-auto">
          <label className="font-medium text-gray-700 block">
            Location Type
          </label>
          {["On-site", "Remote", "Hybrid"].map((loc) => (
            <label key={loc} className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                checked={filters.location.includes(loc)}
                onChange={() => dispatch(updateLocation(loc))}
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t">
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 mr-4"
        >
          Clear All
        </button>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
