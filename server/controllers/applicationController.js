const { UserApplication, Application, Job, UserAccount } = require("../models");

// Get all applications for a user
exports.getApplicationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const appliedJobs = await UserApplication.findAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: "job",
          attributes: [
            "title",
            "company",
            "location",
            "maxWage",
            "minWage",
            "description",
          ],
        },
      ],
    });
    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error.message, error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get application by job ID
exports.getApplicationByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const application = await Application.findOne({
      where: { jobId },
      include: [{ model: Job, as: "job" }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/********** Applied Applications **********/

// Create applied application
exports.createUserApplication = async (req, res) => {
  const { applicationId, userId, jobId, employerId, basicFieldAnswers, questionAnswers } =
    req.body;

  try {
    if (
      !applicationId ||
      !userId ||
      !jobId ||
      !basicFieldAnswers ||
      !questionAnswers ||
      !employerId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const user = await UserAccount.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const status = "Active"

    const newAnswer = await UserApplication.create({
      applicationId,
      userId,
      employerId,
      status,
      jobId,
      basicFieldAnswers,
      questionAnswers,
    });

    return res.status(201).json({
      message: "Application answers submitted successfully.",
      data: newAnswer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get applied application for user
exports.getUserApplication = async (req, res) => {
  const { applicationId, userId } = req.params;

  try {
    const answers = await UserApplication.findOne({
      where: { applicationId, userId },
      include: [
        {
          model: Application,
          as: "application",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!answers) {
      return res.status(404).json({ message: "Answers not found." });
    }

    return res.status(200).json({
      message: "Application answers retrieved successfully.",
      data: answers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get applied application by user_applicationId
exports.getUserApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const answers = await UserApplication.findOne({
      where: { id  },
      include: [
        {
          model: Application,
          as: "application",
        },
      ],
    });

    if (!answers) {
      return res.status(404).json({ message: "Answers not found." });
    }

    return res.status(200).json({
      message: "Application answers retrieved successfully.",
      data: answers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
