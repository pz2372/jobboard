const { EmployerAccount } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');
const { uploadCompanyLogo } = require('../utils/cloudinaryHelper');

// Employer create account
exports.createEmployerAccount = async (req, res) => {
  const {
    companyName,
    email,
    password,
    phoneNumber,
    address,
    city,
    state,
    EIN,
    website,
    logo,
    description
  } = req.body;

  try {
    const existingEmployer = await EmployerAccount.findOne({
      where: { email },
    });
    if (existingEmployer) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = await EmployerAccount.create({
      companyName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      city,
      state,
      EIN,
      website,
      logo,
      description,
    });

    const employerToken = jwt.sign({ id: newEmployer.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set httpOnly cookie
    res.cookie("authToken", employerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Employer account created successfully.",
      employer: {
        id: newEmployer.id,
        companyName: newEmployer.companyName,
        email: newEmployer.email,
        phoneNumber: newEmployer.phoneNumber,
        address: newEmployer.address,
        city: newEmployer.city,
        state: newEmployer.state,
        EIN: newEmployer.EIN,
        website: newEmployer.website,
        logo: newEmployer.logo,
      }
      // Remove employerToken from response
    });
  } catch (error) {
    console.error("Error creating employer account:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Employer logout
exports.logoutEmployerAccount = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employer login
exports.loginEmployerAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await EmployerAccount.findOne({ where: { email } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const employerToken = jwt.sign({ id: employer.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set httpOnly cookie
    res.cookie("authToken", employerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ 
      message: "Login successful", 
      employer 
      // Remove employerToken from response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employer profile
exports.updateEmployerAccount = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const employer = await EmployerAccount.findOne({
      where: { id: id },
    });
    if (!employer) {
      return res.status(404).json({ message: "User not found" });
    }

    await employer.update(updatedFields, { where: { id: id } });


    res.status(200).json({ message: "Profile updated successfully", employer });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}


// Update logo
exports.updateLogo = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using helper function
    const uploadResult = await uploadCompanyLogo(req.file.buffer, id);

    // Save file URL to database
    const employer = await EmployerAccount.findOne({ where: { id: id } });

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    await employer.update({ logo: uploadResult.url });

    res.status(200).json({ message: 'Logo updated successfully', employer });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
}


//Get employer profile
exports.getEmployerProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await EmployerAccount.findOne({ where: { id } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get employer Id
exports.getEmployerId = async (req, res) => {
  const { companyName } = req.params;

  try {
    const employer = await EmployerAccount.findOne({ where: { companyName } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json(employer.id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current authenticated employer
exports.getCurrentEmployer = async (req, res) => {
  try {
    const employerId = req.user.id; // Changed from req.employerId to req.user.id
    
    const employer = await EmployerAccount.findOne({ where: { id: employerId } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json({ employer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
