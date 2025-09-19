import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppDispatch } from "./redux/store";
import { checkEmployerAuth } from "./redux/employerAuthSlice";
import employerLocalStorageService from "./services/employerLocalStorageService";

import './App.css'
import NavBar from './components/NavBar';
import EmployerDataDebugPanel from './components/EmployerDataDebugPanel';
import ProtectedRoute from 'components/ProtectedRoute';
import RedirectIfLoggedIn from "./components/RedirectedIfLoggedIn"

import HomePage from './pages/HomePage';
import JobPage from './pages/user/JobPage';
import LoginPage from './pages/user/account/LoginPage';
import SignupPage from './pages/user/account/SignupPage';
import ForgotPasswordPage from './pages/user/account/ForgotPasswordPage';
import TermsPage from './pages/resources/TermsPage';
import CompanyPage from "./pages/user/CompanyPage"
import ComingSoon from 'pages/ComingSoon';
import FourZeroFour from 'pages/404';

import ProfilePage from './pages/user/ProfilePage';
import HistoryPage from './pages/user/HistoryPage';
import CompleteProfilePage from './pages/user/account/CompleteProfilePage';
import ApplicationPage from './pages/user/ApplicationPage';
import ApplicationSuccessPage from 'pages/user/ApplicationSuccessPage';

import CreateJob from './pages/employer/CreateJob';
import JobSuccess from './pages/employer/JobSuccess';
import CreateApplication from 'pages/employer/CreateApplication';
import ApplicationSuccess from 'pages/employer/ApplicationSuccess';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from 'pages/employer/EmployerProfile';
import EmployerSignup from './pages/employer/EmployerSignup';
import EmployerLogin from './pages/employer/EmployerLogin';
import ApplicantProfilePage from 'pages/employer/ApplicantProfilePage';
import AllApplicationsPage from 'pages/employer/AllApplicationsPage';
import SubscriptionPage from 'pages/employer/SubscriptionPage';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check for existing authentication on app load via httpOnly cookies
    // Note: localStorage no longer contains employer data for security reasons
    console.log("App.tsx: Checking employer authentication on app load...");
    dispatch(checkEmployerAuth())
      .unwrap()
      .then((result) => {
        console.log("App.tsx: Authentication check successful:", result);
      })
      .catch((error) => {
        console.log("App.tsx: Authentication check failed:", error);
      });
  }, [dispatch]);

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
              <Route path="/jobapplication" element={<ApplicationPage />} />
              <Route path="/applicationsuccess" element={<ApplicationSuccessPage/>} />
              {/*<Route path="/application" element={<Application />} />*/}
            </Route>

            {/* Employer Routes */}
            {/*<Route element={<EmployerRoute />}>*/}
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/applications" element={<AllApplicationsPage />} />
              <Route path="/employer/createjob" element={<CreateJob />} />
              <Route path="/user/profile/:userId" element={<ApplicantProfilePage />} />
              <Route path="/employer/jobsuccess" element={<JobSuccess />} />
              <Route path="/employer/createapplication/:jobId" element={<CreateApplication />} />
              <Route path="/employer/applicationsuccess" element={<ApplicationSuccess />} />
              <Route path="/employer/profile" element={<EmployerProfile />} />
              <Route path="/employer/subscription" element={<SubscriptionPage />} />
            {/*</Route>*/}

             {/* Employer Public Routes */}
            <Route path="/employer/signup" element={<RedirectIfLoggedIn><EmployerSignup /></RedirectIfLoggedIn>} />
            <Route path="/employer/login" element={<RedirectIfLoggedIn><EmployerLogin /></RedirectIfLoggedIn>} />
            {/*<Route path="/employer/forgotpassword" element={<EmployerForgotPassword />} />*/}
          </Routes>
        </main>

        {/* Debug Panel for Development */}
        <EmployerDataDebugPanel />
      </div>
    </Router>
  );
}

export default App
