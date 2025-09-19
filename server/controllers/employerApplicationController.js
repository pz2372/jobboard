const {
  Application,
  Job,
  EmployerAccount,
  UserAccount,
  UserApplication,
  UserProfile,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

// Get all applications for a job
exports.getApplications = async (req, res) => {
  try {
    const application = await Application.findAll({
      include: [
        {
          model: EmployerAccount,
          attributes: ["id", "name"],
        },
        {
          model: Job,
          attributes: ["id", "title"],
        },
      ],
    });
    return res.status(200).json(application);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error retrieving applications",
      error: error.message,
    });
  }
};

// Create application
exports.createApplication = async (req, res) => {
  try {
    const { questions, basicFields, documents, employerId, jobId } = req.body;

    // Check if employer and job exist
    const employer = await EmployerAccount.findByPk(employerId);
    const job = await Job.findByPk(jobId);

    if (!employer || !job) {
      return res.status(400).json({
        message: "Employer or Job not found",
      });
    }

    const newApplication = await Application.create({
      questions,
      basicFields,
      documents,
      employerId,
      jobId,
    });

    return res.status(201).json({
      message: "Application configuration saved successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error saving application configuration",
      error: error.message,
    });
  }
};

// Get applied applications for employer
exports.getEmployerAppliedApplications = async (req, res) => {
  const { employerId } = req.params;

  if (!employerId) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: employerId" });
  }

  try {
    const appliedJobs = await UserApplication.findAll({
      where: { employerId },
      attributes: [
        "id", 
        "applicationId", 
        "userId", 
        "employerId", 
        "jobId", 
        "status", 
        "resume", 
        "coverLetter", 
        "basicFieldAnswers", 
        "questionAnswers", 
        "acceptedDate",
        "createdAt", 
        "updatedAt"
      ],
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "location", "status"],
          required: false, // Changed to false to include records even if job is null
        },
        {
          model: Application,
          as: "application",
          attributes: ["id", "questions", "basicFields", "documents"],
          required: false, // Changed to false to include records even if job is null
        },
        {
          model: UserAccount,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
          required: false, // Changed to false to include records even if user is null
          include: [
            {
              model: UserProfile,
              as: "profile", // Adjust this alias based on your model associations
              required: false, // Include even if profile doesn't exist
            },
          ],
        },
      ],
    });

    // Debug: Check specific job IDs that are returning null
    const jobIds = appliedJobs
      .map((app) => app.jobId)
      .filter((id, index, self) => self.indexOf(id) === index);


    if (!appliedJobs || appliedJobs.length === 0) {
      return res.status(200).json([]);
    }


    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error(
      "Error fetching applications for employerId:",
      employerId,
      error
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete an applied job (set status to Delete)
exports.deleteAppliedJob = async (req, res) => {
  const { id } = req.params;

  try {
    const appliedJob = await UserApplication.findByPk(id);

    if (!appliedJob) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    await appliedJob.update({
      status: "Closed",
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Applied job deleted successfully" });
  } catch (error) {
    console.error("Error deleting applied job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an applied job (e.g., change status or update details)
exports.updateAppliedJob = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appliedJob = await UserApplication.findByPk(id);

    if (!appliedJob) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date(),
    };

    // If status is being changed to "Accepted", set the acceptedDate
    if (status === "Accepted") {
      updateData.acceptedDate = new Date();
      
      // Close the job when an applicant is accepted
      await Job.update(
        { status: "Closed" },
        { where: { id: appliedJob.jobId } }
      );
    }

    await appliedJob.update(updateData);

    res.status(200).json({
      message: "Applied job updated successfully",
      data: appliedJob,
    });
  } catch (error) {
    console.error("Error updating applied job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept an application (dedicated method)
exports.acceptApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const appliedJob = await UserApplication.findByPk(id);

    if (!appliedJob) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status to "Accepted" and set acceptedDate
    await appliedJob.update({
      status: "Accepted",
      acceptedDate: new Date(),
      updatedAt: new Date(),
    });

    // Close the job when an applicant is accepted
    await Job.update(
      { status: "Closed" },
      { where: { id: appliedJob.jobId } }
    );

    res.status(200).json({
      message: "Application accepted successfully",
      data: appliedJob,
    });
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};
