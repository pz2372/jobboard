const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
//const authMiddleware = require('./middleware/authMiddleware');
const userAccountRoutes = require('./routes/userAccountRoutes');
const employerAccountRoutes = require('./routes/employerAccountRoutes');
const applicationRoutes = require('./routes/applicationRoutes')
const employerApplicationRoutes = require('./routes/employerApplicationRoutes')
const employerJobRoute = require('./routes/employerJobRoutes')
const savedJobRoutes = require('./routes/savedJobRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const userProfileRoutes = require('./routes/userProfileRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
//app.use(authMiddleware);

// Routes
app.use('/api/jobs', jobRoutes); 
app.use('/api/user', userAccountRoutes);
app.use('/api/employer', employerAccountRoutes);
app.use('/api/employerapplication', employerApplicationRoutes)
app.use('/api/applications', applicationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/savedjobs', savedJobRoutes);
app.use('/api/employerjob', employerJobRoute);
app.use('/api/userprofile', userProfileRoutes);
app.use('/api/subscriber', subscriberRoutes);

app.listen(port, () => {
});
