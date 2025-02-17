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
  });

  return (
    <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
