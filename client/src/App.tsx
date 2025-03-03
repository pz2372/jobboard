import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import ProtectedRoute from 'components/ProtectedRoute';
import RedirectIfLoggedIn from "./components/RedirectedIfLoggedIn"

import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';
import CompanyPage from "./pages/CompanyPage"
import ComingSoon from 'pages/ComingSoon';
import FourZeroFour from 'pages/404';

import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ApplicationPage from './pages/ApplicationPage';
import ApplicationSuccessPage from 'pages/ApplicationSuccessPage';

import CreateJob from './pages/employer/CreateJob';
import JobSuccess from './pages/employer/JobSuccess';
import CreateApplication from 'pages/employer/CreateApplication';
import ApplicationSuccess from 'pages/employer/ApplicationSuccess';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from 'pages/employer/EmployerProfile';
import EmployerSignup from './pages/employer/EmployerSignup';
import EmployerLogin from './pages/employer/EmployerLogin';

const App = () => {

  return (
    <Router>
      <div className="w-full bg-teal-50">
        <NavBar  />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobPage />} />
            <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
            <Route path="/signup" element={<RedirectIfLoggedIn><SignupPage /></RedirectIfLoggedIn>} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/company/:employerId" element={<CompanyPage />} />
            <Route path="/terms/:item" element={<TermsPage />} /> 
            <Route path="/comingsoon" element={<ComingSoon />} />
            <Route path="/404" element={<FourZeroFour />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/completeprofile" element={<CompleteProfilePage />} />
              <Route path="/jobapplication/:jobId" element={<ApplicationPage />} />
              <Route path="/applicationsuccess" element={<ApplicationSuccessPage/>} />
              {/*<Route path="/application" element={<Application />} />*/}
            </Route>

            {/* Employer Routes */}
            {/*<Route element={<EmployerRoute />}>*/}
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/employer/createjob" element={<CreateJob />} />
              <Route path="/employer/jobsuccess" element={<JobSuccess />} />
              <Route path="/employer/createapplication/:jobId" element={<CreateApplication />} />
              <Route path="/employer/applicationsuccess" element={<ApplicationSuccess />} />
              <Route path="/employer/profile" element={<EmployerProfile />} />
            {/*</Route>*/}

             {/* Employer Public Routes */}
            <Route path="/employer/signup" element={<RedirectIfLoggedIn><EmployerSignup /></RedirectIfLoggedIn>} />
            <Route path="/employer/login" element={<RedirectIfLoggedIn><EmployerLogin /></RedirectIfLoggedIn>} />
            {/*<Route path="/employer/forgotpassword" element={<EmployerForgotPassword />} />*/}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
