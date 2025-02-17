const { Job } = require("../models");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const sequelize = require("../models");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

//Get Searched Jobs
exports.getSearchJobs = async (req, res) => {
  try {
    const { searchQuery, searchLocation } = req.query;

    // Check if searchTerm is empty
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({ message: "Search term is required" })
    }

    // Build the query conditions
    const conditions = {
      [Op.and]: [
        {
          [Op.or]: [
            // ILIKE for partial matching
            { title: { [Op.iLike]: `%${searchQuery}%` } },
            { description: { [Op.iLike]: `%${searchQuery}%` } },
            // Full-text search
            literal(
              `"search_vector" @@ to_tsquery('english', '${searchQuery}')`
            ),
            // Fuzzy matching using pg_trgm
            literal(`title % '${searchQuery}' OR description % '${searchQuery}'`),
          ],
        },
      ],
    };

    if (searchLocation) {
      conditions[Op.and].push({ location: { [Op.iLike]: `%${searchLocation}%` } });
    }

    const jobs = await Job.findAndCountAll({
      where: conditions,
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).send("Error searching jobs");
  }
};

// Get search by industry
exports.getSearchIndustry = async (req, res) => {
  const { industry } = req.query;

  try {
    const jobs = await Job.findAll({
      where: { industry: industry },
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job by id
exports.getJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findByPk(jobId); // Sequelize query
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs with optional filters
exports.getJobs = async (req, res) => {
  const { title, location, minWage, maxWage, type, experience } = req.query;

  // Build filter conditions based on query parameters
  let filterConditions = {};

  if (title && title.trim() !== "") {
    filterConditions.title = { [Op.iLike]: `%${title}%` };
  }
  if (location && location.trim() !== "") {
    filterConditions.location = { [Op.iLike]: `%${location}%` };
  }
  if (minWage && maxWage) {
    filterConditions = {
      ...filterConditions,
      minWage: { [Op.lte]: parseFloat(minWage) },
      maxWage: { [Op.gte]: parseFloat(maxWage) },
    };
  } else if (minWage) {
    filterConditions.minWage = { [Op.lte]: parseFloat(minWage) };
  } else if (maxWage) {
    filterConditions.maxWage = { [Op.gte]: parseFloat(maxWage) };
  }
  if (type && type.trim() !== "") {
    filterConditions.type = type;
  }

  try {
    const jobs = await Job.findAll({
      where: filterConditions,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get recommended jobs
exports.getRecommendations = async (req, res) => {
  try {
    const jobs = await Job.findAll({ limit: 6 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
