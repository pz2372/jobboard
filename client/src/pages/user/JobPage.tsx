import React, { useEffect, useState, useMemo } from "react";
import SearchBar from "../../components/SearchBar";
import JobCard from "components/JobCard";
import JobModal from "components/JobModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { Job } from "components/interfaces/Job";
import { useSearchParams } from "react-router-dom";
import { RootState } from "redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setSearchParams, setJobs, clearJobs } from "../../redux/searchSlice";
import { ArrowRight, Building2, Clock, Search, MapPin, Briefcase } from "lucide-react";

const JobPage = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const savedJobs = useSelector((state: RootState) => state.history.savedJobs);
  const appliedJobs = useSelector((state: RootState) => state.history.appliedJobs);
  const searchState = useSelector((state: RootState) => state.search);
  const navigate = useNavigate();

  // Get search params from Redux or URL params (URL params take precedence for initial load)
  const searchQuery = urlParams.get("searchQuery") || searchState.searchQuery;
  const searchLocation = urlParams.get("searchLocation") || searchState.searchLocation;
  const industry = urlParams.get("industry") || searchState.industry;
  const minWage = urlParams.get("minWage") || searchState.minWage;
  const maxWage = urlParams.get("maxWage") || searchState.maxWage;
  const type = urlParams.get("type") || searchState.type;

  // Sync URL params with Redux state on component mount
  useEffect(() => {
    const urlSearchParams = {
      searchQuery: urlParams.get("searchQuery") || "",
      searchLocation: urlParams.get("searchLocation") || "",
      industry: urlParams.get("industry") || "",
      minWage: urlParams.get("minWage") || "",
      maxWage: urlParams.get("maxWage") || "",
      type: urlParams.get("type") || "",
    };
    
    // Only update Redux if URL params exist or Redux state is empty
    if (Object.values(urlSearchParams).some(val => val !== "") || 
        Object.values(searchState).every(val => val === "" || val === null || val === true)) {
      dispatch(setSearchParams(urlSearchParams));
    }
  }, []); // Only run on mount

  // Memoized filter function using Redux data - only recalculates when saved/applied jobs change
  const filterUserInteractedJobs = useMemo(() => {
    if (!user?.id) {
      return (jobsList: Job[]) => jobsList; // Don't filter if user is not logged in
    }
    
    const savedJobIds = savedJobs.map((job: any) => job.jobId || job.id);
    const appliedJobIds = appliedJobs.map((job: any) => job.jobId || job.id);
    
    return (jobsList: Job[]) => {
      return jobsList.filter((job) => {
        const isNotSaved = !savedJobIds.includes(job.id);
        const isNotApplied = !appliedJobIds.includes(job.id);
        return isNotSaved && isNotApplied;
      });
    };
  }, [user?.id, savedJobs, appliedJobs]);

  useEffect(() => {
    dispatch(clearJobs()); // Clear jobs when search params change

    if (minWage || maxWage || type) {
      fetchFilteredJobs();
    } else if (searchLocation) {
      fetchJobs();
    } else if (industry) {
      fetchIndustryJobs();
    }
  }, [searchLocation]); // Simplified dependency

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/searchjobs", {
        params: { searchLocation },
      });

      if (response.data.length > 0) {
        const filteredJobs = filterUserInteractedJobs(response.data);
        dispatch(setJobs(filteredJobs));
      } else {
        dispatch(setJobs([]));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      dispatch(setJobs([]));
    }
  };

  const fetchFilteredJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/filteredJobs", {
        params: { searchQuery, searchLocation, minWage, maxWage, type },
      });

      if (response.data.rows?.length > 0) {
        const filteredJobs = filterUserInteractedJobs(response.data.rows);
        dispatch(setJobs(filteredJobs));
      } else {
        dispatch(setJobs([]));
      }
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
      dispatch(setJobs([]));
    }
  };

  const fetchIndustryJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/searchindustry", {
        params: { industry },
      });
      if (response.data.length > 0) {
        const filteredJobs = filterUserInteractedJobs(response.data);
        dispatch(setJobs(filteredJobs));
      } else {
        dispatch(setJobs([]));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      dispatch(setJobs([]));
    }
  };

  // Check if any search parameters exist
  const hasSearchParams = searchQuery || searchLocation || industry || minWage || maxWage || type;

  return (
    <>
      <div className="relative">
        <SearchBar />
        
        {/* Show initial welcome state when no search has been performed */}
        {!hasSearchParams && (
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-teal-50 rounded-full">
                  <Search className="w-12 h-12 text-teal-600" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 font-comic">
                Find Your Shift
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Start your job search by entering a location in the search bar above
              </p>
            </div>
          </div>
        )}

        {/* Show jobs grid when there are search results */}
        {hasSearchParams && (
          <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {searchState.jobs &&
              searchState.jobs?.map((job, index) => (
                <JobCard
                  key={index}
                  job={job}
                  index={index}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
          </div>
        )}
      </div>

      {(searchState.jobs == null || searchState.jobs.length == 0) && searchLocation && (
        <div>
          <h3 className="text-3xl text-center mb-10 font-bold text-teal-600 font-comic">
            No Search Results
          </h3>
        </div>
      )}

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {!user && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-white font-comic">
              Join For More Opportunities
            </h2>
            <p className="text-teal-50 mb-8 text-lg max-w-2xl mx-auto">
              Find your opportunity today
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-teal-600 px-10 py-4 rounded-full hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 mx-auto flex items-center gap-2 font-semibold shadow-lg"
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPage;
