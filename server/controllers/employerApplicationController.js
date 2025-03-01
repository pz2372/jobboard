const {
  Application,
  Job,
  EmployerAccount,
  UserAccount,
  UserApplication,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

// Get all applications for a job
exports.getApplications = async (req, res) => {
  try {
    const application = await Application.findAll({
      include: [
        {
          model: Employer,
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
      attributes: ["id", "applicationId"],
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["title"],
        },
        {
          model: UserAccount,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    if (!appliedJobs || appliedJobs.length === 0) {
      return res.status(200).json([]);
    }

    const response = appliedJobs.map((appliedJob) => ({
      Id: appliedJob.id,
      jobId: appliedJob.job.id,
      title: appliedJob.job.title,
      location: appliedJob.job.location,
      applicationId: appliedJob.applicationId,
      userId: appliedJob.user.id,
      user: {
        id: appliedJob.user.id,
        firstName: appliedJob.user.firstName,
        lastName: appliedJob.user.lastName,
        email: appliedJob.user.email,
      },
      createdOn: appliedJob.createdAt,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(
      "Error fetching applications for employerId:",
      employerId,
      error
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete an applied job (set deletedOn date)
exports.deleteAppliedJob = async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await AppliedJobs.update(
      { deletedOn: new Date() },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    res.status(200).json({ message: "Applied job soft deleted successfully" });
  } catch (error) {
    console.error("Error deleting applied job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an applied job (e.g., change status or update details)
exports.updateAppliedJob = async (req, res) => {
  const { jobId } = req.params;
  const { status, applicationId } = req.body;

  try {
    const [updated] = await AppliedJobs.update(
      { status, applicationId, updatedOn: new Date() },
      { where: { jobId } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    res.status(200).json({ message: "Applied job updated successfully" });
  } catch (error) {
    console.error("Error updating applied job:", error);
    res.status(500).json({ message: "Server error" });
  }
};
