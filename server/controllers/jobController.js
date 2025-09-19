const { Job } = require("../models");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/db"); // Import the Sequelize instance

// City clusters for nearby city searching
const cityClusters = {
  // North Carolina Research Triangle
  'Raleigh': ['Raleigh', 'Durham', 'Cary', 'Apex', 'Chapel Hill', 'Morrisville', 'Wake Forest'],

  // New York Metro
  'New York': ['New York', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Jersey City', 'Hoboken'],
  
  // Los Angeles Metro
  'Los Angeles': ['Los Angeles', 'Hollywood', 'Beverly Hills', 'Santa Monica', 'Pasadena', 'Glendale', 'Burbank'],
  
  // Chicago Metro
  'Chicago': ['Chicago', 'Evanston', 'Oak Park', 'Cicero', 'Skokie', 'Elmhurst', 'Naperville'],
  
  // San Francisco Bay Area
  'San Francisco': ['San Francisco', 'Oakland', 'San Jose', 'Berkeley', 'Palo Alto', 'Mountain View', 'Fremont'],
  
  // Boston Metro
  'Boston': ['Boston', 'Cambridge', 'Somerville', 'Quincy', 'Newton', 'Brookline', 'Medford'],
  
  // Atlanta Metro
  'Atlanta': ['Atlanta', 'Decatur', 'Marietta', 'Roswell', 'Sandy Springs', 'Dunwoody', 'Alpharetta'],

  // Dallas-Fort Worth
  'Dallas': ['Dallas', 'Fort Worth', 'Plano', 'Irving', 'Garland', 'Mesquite', 'Richardson'],
  
  // Houston Metro
  'Houston': ['Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Pearland', 'Pasadena', 'Baytown'],
  
  // Miami Metro
  'Miami': ['Miami', 'Miami Beach', 'Coral Gables', 'Hialeah', 'Kendall', 'Homestead', 'Doral'],
  
  // Seattle Metro
  'Seattle': ['Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Renton', 'Tacoma', 'Everett'],
  
  // Phoenix Metro
  'Phoenix': ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Glendale', 'Chandler', 'Peoria'],
  
  // Denver Metro
  'Denver': ['Denver', 'Aurora', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Centennial'],
};

// Function to get nearby cities for a given search location
const getNearbyCities = (searchLocation) => {
  // Convert to title case for lookup
  const titleCaseLocation = searchLocation.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  return cityClusters[titleCaseLocation] || [titleCaseLocation];
};

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
    const { searchLocation } = req.query;

    if (!searchLocation || searchLocation.trim() === "") {
      return res.status(400).json({ message: "Search location is required" });
    }

    // Build the query conditions for location-based search
    const nearbyCities = getNearbyCities(searchLocation);
    const cityConditions = nearbyCities.map(city => ({
      city: { [Op.iLike]: `%${city}%` }
    }));
    
    const conditions = {
      [Op.or]: cityConditions
    };

    const jobs = await Job.findAll({
      where: conditions,
      order: [["createdAt", "DESC"]], // Order by newest first
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
  const { searchQuery, searchLocation, minWage, maxWage, type, experience } = req.query;

  // Build filter conditions based on query parameters
  let filterConditions = {};

  if (searchQuery && searchQuery.trim() !== "") {
    filterConditions.searchQuery = { [Op.iLike]: `%${searchQuery}%` };
  }
  if (searchLocation && searchLocation.trim() !== "") {
    const nearbyCities = getNearbyCities(searchLocation);
    const cityConditions = nearbyCities.map(city => ({
      city: { [Op.iLike]: `%${city}%` }
    }));
    
    filterConditions[Op.or] = cityConditions;
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
