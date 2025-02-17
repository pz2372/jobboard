import React, { useState } from "react";
import {
  UserCircle,
  BriefcaseIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "axiosInstance";
import { useDispatch, useSelector } from 'react-redux';
import { signup } from "../redux/authSlice"
import { AppDispatch } from "redux/store";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = formData;
    dispatch(signup({ firstName, lastName, email, password }))
      .unwrap()
      .then(() => {
        navigate("/completeprofile");
      })
      .catch((err) => {
        console.error("Signup failed:", err);
      });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-teal-600 font-comic tracking-wide">
          Create Account
        </h1>
        <p className="text-gray-600 text-lg">
          Sign up to start your job search
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
        <form className="space-y-6">
          <div className="relative">
            <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="firstName"
              placeholder="First Name"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>

          <div className="relative">
            <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="lastName"
              placeholder="Last Name"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>

          <div className="relative">
            <MailIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>

          <div className="relative">
            <LockIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-gray-400 hover:text-teal-600"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <LockIcon className="absolute left-4 top-3.5 text-teal-600 w-5 h-5" />
            <input
              type="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link
              to="forgotpassword"
              className="text-teal-600 hover:text-teal-500"
            >
              Forgot password
            </Link>
          </div>

          <button
            onClick={handleCreateAccount}
            className="w-full bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-500 transition-all duration-300 transform hover:scale-105"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 hover:text-teal-500 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
