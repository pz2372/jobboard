import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import axiosInstance from "axiosInstance";
import { Job } from "./interfaces/Job";

const RecommendedJobs = ({ onClick }: { onClick: (job: Job) => void }) => {
  const [jobs, setJobs] = useState<Job[]|null>(null);

  useEffect(() => {
    axiosInstance
      .get("jobs/recommendation")
      .then((response) => {
        setJobs(response.data)
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="grid mx-5 md:mx-0 lg:mx-0 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-8">
      {jobs &&
        jobs.map((job, index) => (
          <JobCard
            key={index}
            job={job}
            index={index}
            onClick={() => onClick(job)}
          />
        ))}
    </div>
  );
};

export default RecommendedJobs;
