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

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              JobConnect
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Connecting talent with opportunities, bridging the gap between
                education and employment.
              </p>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Information
            </h3>
            <ul className="space-y-3">
              {[
                "About Us",
                "Contact",
                "Terms & Conditions",
                "Privacy Policy",
                "Press & Media",
              ].map((item) => (
                <li key={item}>
                  <a className="text-gray-600 hover:text-teal-600 transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                "Career Guide",
                "Interview Tips",
                "Resume Builder",
                "Job Search Tips",
                "Student Resources",
              ].map((item) => (
                <li key={item}>
                  <a className="text-gray-600 hover:text-teal-600 transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {item}
                  </a>
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
