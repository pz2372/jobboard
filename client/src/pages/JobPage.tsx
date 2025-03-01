import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import JobCard from "components/JobCard";
import JobModal from "components/JobModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import RecommendedJobs from "components/RecommendedJobs";
import { Job } from "components/interfaces/Job";
import { useSearchParams } from "react-router-dom";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";

const JobPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [noSearchResults, setNoSearchResults] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const searchQuery = searchParams.get("searchQuery") || "";
  const searchLocation = searchParams.get("searchLocation") || "";
  const industry = searchParams.get("industry") || "";
  const minWage = searchParams.get("minWage") || "";
  const maxWage = searchParams.get("maxWage") || "";
  const type = searchParams.get("type") || "";

  useEffect(() => {
    setJobs(null)

    if (minWage || maxWage || type) {
      fetchFilteredJobs();
    } else if (searchQuery || searchLocation) {
      fetchJobs();
    } else if (industry) {
      fetchIndustryJobs();
    }
  }, [searchQuery, searchLocation]);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/searchjobs", {
        params: { searchQuery, searchLocation },
      });
      if (response.data.rows.length > 0) {
        setJobs(response.data.rows);
        setNoSearchResults(false);
      } else {
        setNoSearchResults(true);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchFilteredJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/filteredJobs", {
        params: { searchQuery, searchLocation, minWage, maxWage, type },
      });
  
      if (response.data.rows?.length > 0) {
        setJobs(response.data.rows);
        setNoSearchResults(false);
      } else {
        setNoSearchResults(true);
      }
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  const fetchIndustryJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/searchindustry", {
        params: { industry },
      });
      if (response.data.length > 0) {
        setJobs(response.data);
        setNoSearchResults(false);
      } else {
        setNoSearchResults(true);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <SearchBar />
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs &&
            jobs?.map((job, index) => (
              <JobCard
                key={index}
                job={job}
                index={index}
                onClick={() => setSelectedJob(job)}
              />
            ))}
        </div>
      </div>

      {(jobs == null || jobs.length == 0) && (searchQuery || searchLocation) && (
        <div>
          <h3 className="text-3xl text-center mb-10 font-bold text-teal-600 font-comic">
            No Search Results
          </h3>
        </div>
      )}

      {(jobs == null || jobs.length < 6) && (
        <div>
          <h3 className="text-3xl text-center font-bold text-teal-600 font-comic">
            Recommended Jobs
          </h3>
          <RecommendedJobs onClick={setSelectedJob} />
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
