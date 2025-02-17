import React from "react";
import {
  Search,
  MapPin,
  DollarSign,
  ArrowRight,
  UserCircle,
  Building2,
  BriefcaseIcon,
  SlidersHorizontal,
  ClipboardCheckIcon,
  SearchIcon,
  SendIcon,
  GraduationCapIcon,
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  CheckCircleIcon,
  MailIcon,
  Star,
  TrendingUp,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  Award,
  Users,
  Building,
  Globe,
  Linkedin,
  Target,
  Shield,
  Rocket,
  Code,
  Briefcase,
  HeartPulse,
  PenTool,
  Smartphone,
  Factory,
  Coffee,
  Phone,
  MapPinIcon,
} from "lucide-react";
import Logo from "../images/footer_logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-teal-50 pt-10 pb-3 animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              <img src={Logo} className="w-[100px]" />
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 ml-2">
                Connecting talent with opportunities, bridging the gap between
                education and employment.
              </p>
            </div>
          </div>

          <div></div>
          <div className="pt-5">
            <Link to="/login">
            <button className="w-[100%] mb-5 py-4 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition-all hover:shadow-xl flex items-center justify-center gap-2 text-lg font-semibold">
              User Login
            </button>
            </Link>
          
          <Link to="employer/login">
            <button className="w-[100%] py-4 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition-all hover:shadow-xl flex items-center justify-center gap-2 text-lg font-semibold">
              Employer Login
            </button>
            </Link>
          </div>

          {/* Information */}
          <div className="pt-2 mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Information
            </h3>
            <ul className="space-y-3">
              {[
                "User Agreement",
                "Terms & Conditions",
                "Privacy Policy",
                "Cookie Policy",
              ].map((item) => (
                <li key={item}>
                  <Link to={`/terms/${encodeURIComponent(item)}`} className="text-gray-600 hover:text-teal-600 transition-colors flex items-center">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="pt-2 mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                "Interview Tips",
                "Resume Builder",
                "Job Search Tips",
                "Student Resources",
              ].map((item) => (
                <li key={item}>
                  <Link to={"/comingsoon"} className="text-gray-600 hover:text-teal-600 transition-colors flex items-center">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} My First Shift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
