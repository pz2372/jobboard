import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';

import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';

import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ApplicationPage from './pages/employer/ApplicationPage';

import CreateJob from './pages/employer/CreateJob';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerSignup from './pages/employer/EmployerSignup';
import EmployerLogin from './pages/employer/EmployerLogin';

const App = () => {

  return (
    <Router>
      <div className="w-full min-h-screen bg-teal-50">
        <NavBar  />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/terms" element={<TermsPage />} /> 

            {/* Protected Routes */}
            {/*<Route element={<ProtectedRoute />}>*/}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/completeprofile" element={<CompleteProfilePage />} />
              <Route path="/jobapplication" element={<ApplicationPage />} />
              {/*<Route path="/application" element={<Application />} />*/}
            {/*</Route>*/}

            {/* Employer Routes */}
            {/*<Route element={<EmployerRoute />}>*/}
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/createjob" element={<CreateJob />} />
            {/*</Route>*/}

             {/* Employer Public Routes */}
            <Route path="/employer/signup" element={<EmployerSignup />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            {/*<Route path="/employer/forgotpassword" element={<EmployerForgotPassword />} />*/}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
