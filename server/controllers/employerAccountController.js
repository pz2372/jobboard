const { EmployerAccount } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const s3Client = require('../config/awsConfig');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

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

    const employerToken = jwt.sign({ id: newEmployer.id }, "yourSecretKey", {
      expiresIn: "1h",
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
      },
      employerToken
    });
  } catch (error) {
    console.error("Error creating employer account:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
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

    res.cookie("token", employerToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", employerToken, employer });
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

    const file = req.file;
    const fileExtension = path.extname(file.originalname);
    const fileName = `employers/${id}/${Date.now()}${fileExtension}`;

    // Upload to S3
    const params = {
      Bucket: 'shiftlink',
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3Client.send(new PutObjectCommand(params));
    logo = `https://shiftlink.s3.us-east-1.amazonaws.com/${fileName}`;

    // Save file URL to database
    const employer = await EmployerAccount.findOne({ where: { id: id } });

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    await employer.update({ logo });

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
