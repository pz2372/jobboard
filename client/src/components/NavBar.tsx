import React from "react";
import logo from "../images/logo.png";
import mobileLogo from "../images/mobile_logo.png";
import { BriefcaseIcon, TableOfContents, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";

const NavBar = () => {
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );

  return (
    <>
      {/* Mobile Logo (Above Navbar) */}
      <div className="w-full flex justify-center pt-4 md:hidden">
        <Link to="/">
          <img src={mobileLogo} className="w-[160px] h-auto" />
        </Link>
      </div>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg rounded-full w-[98%] max-w-7xl mx-auto px-6 backdrop-blur-sm bg-opacity-95 border border-teal-500/20 z-40 my-4 md:mt-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo inside Navbar (Hidden on Mobile) */}
          <div className="px-5 min-w-fit hidden md:block">
            <Link to="/">
              <img src={logo} className="w-[120px] h-auto" />
            </Link>
          </div>

          {/* Navigation Items */}
          {employer ? (
            <div className="flex flex-grow justify-center gap-8">
              <Link
                to="/employer"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <BriefcaseIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Dashboard
                </span>
              </Link>
              <div className="w-px h-6 bg-white/20 rounded-full"></div>
              <Link
                to="/employer/settings"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <TableOfContents className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Settings
                </span>
              </Link>
              <div className="w-px h-6 bg-white/20 rounded-full"></div>
              <Link
                to="/employer/profile"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <UserCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Profile
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-grow justify-center gap-8">
              <Link
                to="/jobs"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <BriefcaseIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Jobs
                </span>
              </Link>
              <div className="w-px h-6 bg-white/20 rounded-full"></div>
              <Link
                to="/history"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <TableOfContents className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  History
                </span>
              </Link>
              <div className="w-px h-6 bg-white/20 rounded-full"></div>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-white/90 font-medium group transition-all duration-300 hover:scale-110"
              >
                <div className="relative">
                  <UserCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Profile
                </span>
              </Link>
            </div>
          )}

          {/* Empty div for spacing, only needed for desktop */}
          <div className="w-[100px] hidden md:block"></div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
