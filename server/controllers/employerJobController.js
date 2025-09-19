const { Job, UserApplication } = require("../models");
const { Op, fn, col } = require('sequelize');
const JobPostingLimitService = require('../services/jobPostingLimitService');
const { uploadJobImage } = require('../utils/cloudinaryHelper');
const path = require('path');

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
    payRate,
    payFrequency,
    logo,
    description,
    requirements,
    skills,
    tags,
    jobImage
  } = req.body;

  try {
    // Check if employer can post a job based on their subscription
    const limitCheck = await JobPostingLimitService.canPostJob(employerId);
    
    if (!limitCheck.canPost) {
      let message = 'Unable to create job post.';
      let statusCode = 403;
      
      switch (limitCheck.reason) {
        case 'NO_SUBSCRIPTION':
          message = 'Active subscription required to post jobs.';
          statusCode = 402; // Payment Required
          break;
        case 'MONTHLY_LIMIT_REACHED':
          message = `Monthly job posting limit reached. You can post ${limitCheck.maxPostsPerMonth} job(s) per month. Counter resets on ${limitCheck.resetDate?.toLocaleDateString()}.`;
          break;
        case 'INVALID_PLAN':
          message = 'Invalid subscription plan.';
          break;
        default:
          message = 'Unable to verify job posting limits.';
      }
      
      return res.status(statusCode).json({ 
        success: false,
        message,
        limitInfo: limitCheck
      });
    }

    // Handle job image upload if provided
    let jobImageUrl = null;
    if (jobImage && typeof jobImage === 'object' && jobImage.data) {
      try {
        const imageBuffer = Buffer.from(jobImage.data, 'base64');
        const uploadResult = await uploadJobImage(imageBuffer, `job_${Date.now()}`);
        jobImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading job image:', uploadError);
        // Continue with job creation even if image upload fails
        // You might want to return an error here instead depending on requirements
      }
    }

    // Create the job
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
      payRate,
      payFrequency,
      logo,
      jobImage: jobImageUrl,
      description,
      requirements,
      skills,
      tags
    });

    // Increment the job posting counter
    await JobPostingLimitService.incrementJobPostCounter(employerId);

    res.status(201).json({ 
      success: true,
      message: "Job created successfully", 
      newJob,
      remainingPosts: limitCheck.remainingPosts - 1
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  const { jobId } = req.params;
  const {
    title,
    type,
    address,
    city,
    state,
    zipCode,
    industry,
    description,
    payRate,
    payFrequency,
    requirements,
    tags,
    status,
    jobImage
  } = req.body;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prepare update data - only include fields that are provided
    const updateData = {
      updatedAt: new Date()
    };

    // Add fields to update if they are provided
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (industry !== undefined) updateData.industry = industry;
    if (description !== undefined) updateData.description = description;
    if (payRate !== undefined) updateData.payRate = payRate;
    if (payFrequency !== undefined) updateData.payFrequency = payFrequency;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) updateData.status = status;

    // Handle job image update if provided
    if (jobImage && typeof jobImage === 'object' && jobImage.data) {
      try {
        const imageBuffer = Buffer.from(jobImage.data, 'base64');
        const uploadResult = await uploadJobImage(imageBuffer, `job_${jobId}_${Date.now()}`);
        updateData.jobImage = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading job image:', uploadError);
        // Continue with job update even if image upload fails
      }
    }

    console.log("Updating job", jobId, "with data:", updateData);

    await job.update(updateData);

    // Fetch the updated job to return it
    const updatedJob = await Job.findByPk(jobId);
    
    console.log("Job updated successfully:", updatedJob.id, "new status:", updatedJob.status);
    
    res.status(200).json({ 
      message: "Job updated successfully", 
      job: updatedJob 
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a job (soft delete)
exports.deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.update({
      status: "Closed",
      updatedAt: new Date()
    });
    
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
        .status(200)
        .json([]);
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
};

// Get job posting usage for an employer
exports.getJobPostingUsage = async (req, res) => {
  const { employerId } = req.params;

  if (!employerId) {
    return res.status(400).json({ error: "Employer ID is required." });
  }

  try {
    const usage = await JobPostingLimitService.getJobPostingUsage(employerId);
    res.status(200).json({
      success: true,
      usage
    });
  } catch (error) {
    console.error("Error fetching job posting usage:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch job posting usage." 
    });
  }
};

// Check if employer can post a job
exports.checkJobPostingLimit = async (req, res) => {
  const { employerId } = req.params;

  if (!employerId) {
    return res.status(400).json({ error: "Employer ID is required." });
  }

  try {
    const limitCheck = await JobPostingLimitService.canPostJob(employerId);
    res.status(200).json({
      success: true,
      limitCheck
    });
  } catch (error) {
    console.error("Error checking job posting limit:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to check job posting limit." 
    });
  }
};
