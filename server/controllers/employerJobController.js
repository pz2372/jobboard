const { Job, UserApplication } = require("../models");
const { Op, fn, col } = require('sequelize');

// Create a job
exports.createJob = async (req, res) => {
  const {
    employerId,
    companyName,
    title,
    type,
    address,
    city,
    state,
    industry,
    experience,
    minWage,
    maxWage,
    logo,
    description,
    requirements,
    skills,
    tags
  } = req.body;

  try {
    const newJob = await Job.create({
      employerId,
      companyName,
      title,
      type,
      status: "Active",
      address,
      city,
      state,
      industry,
      experience,
      minWage,
      maxWage,
      logo,
      description,
      requirements,
      skills,
      tags
    });

    res.status(201).json({ message: "Job created successfully", newJob });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, salary, location, requirements } = req.body;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.update({ title, description, salary, location, requirements });
    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs by employer
exports.getJobsByEmployer = async (req, res) => {
  const { employerId } = req.params;

  if (!employerId) {
    return res.status(400).json({ error: "Employer ID is required." });
  }

  try {
    const jobs = await Job.findAll({
      where: {
        employerId,
      },
      attributes: {
        include: [[fn("COUNT", col("userApplication.id")), "applicantCount"]],
      },
      include: [
        {
          model: UserApplication,
          as: 'userApplication',
          attributes: [],
        },
      ],
      group: ["Job.id"],
      order: [["createdAt", "DESC"]],
    });

    if (!jobs.length) {
      return res
        .status(404)
        .json({ message: "No jobs found for this employer." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
};
