import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import JobCard from "components/JobCard";
import JobModal from "components/JobModal";

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

const JobPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null)
  
  return (
    <>
      <div className="relative">
        <SearchBar />
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} index={index} onClick={() => setSelectedJob(job)}/>
          ))}
        </div>
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)}/>}

      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white font-comic">
            Join For More Opportunities
          </h2>
          <p className="text-teal-50 mb-8 text-lg max-w-2xl mx-auto">
            Find your opportunity today
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
