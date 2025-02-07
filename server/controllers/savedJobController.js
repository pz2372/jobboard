const { Job, SavedJobs } = require("../models");

// Get saved jobs for a user
exports.getSavedJobs = async (req, res) => {
  const { userId } = req.params;

  try {
    const savedJobs = await SavedJobs.findAll({
      where: { userId },
      include: [
        {
          model: Job, 
          as: 'job',
        },
      ],
    });

    res.status(200).json(savedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

// Add saved job
exports.addSavedJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    // Check if a saved job entry already exists for this user and job
    const [userJobs, created] = await SavedJobs.findOrCreate({
      where: { userId, jobId }, // Find by both userId and jobId
      defaults: { userId, jobId }, // If not found, create a new entry with userId and jobId
    });

    if (!created) {
      return res.status(400).json({ message: "Job already saved for this user" });
    }

    // Respond with the saved job entry
    res.status(200).json(userJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving job" });
  }
};


// Delete saved job
exports.deleteSavedJob = async (req, res) => {
  const { userId, jobId } = req.params;

  try {
    // Find the saved job entry
    const userJobs = await SavedJobs.findOne({ where: { userId, jobId } });

    // If the job is not found, return an error response
    if (!userJobs) {
      return res.status(404).json({ error: "Saved job not found" });
    }

    // Delete the saved job entry
    await userJobs.destroy();

    // Respond with a success message
    res.status(200).json({ message: "Saved job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the saved job" });
  }
};