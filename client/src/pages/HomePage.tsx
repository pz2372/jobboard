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
  Heater,
  LampFloor,
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
  UserPlus,
  Send
} from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "components/SearchBar";
import Footer from "components/Footer";
import AmazonLogo from '../images/amazon.png';
import HarrisLogo from '../images/harris.png';
import McDonaldsLogo from '../images/mcdonalds.png';
import NikeLogo from '../images/nike.png';
import WalmartLogo from '../images/walmart.png';
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Heater,
    title: "Restaurant",
  },
  {
    icon: Briefcase,
    title: "Warehouse",
  },
  {
    icon: LampFloor,
    title: "Retail",
  },
  {
    icon: PenTool,
    title: "Customer Service",
  },
  {
    icon: Smartphone,
    title: "Sales",
  },
  {
    icon: Factory,
    title: "Factory",
  },
  {
    icon: Coffee,
    title: "Cafe",
  },
  {
    icon: Globe,
    title: "Education",
  },
]

const HomePage = () => {
  const [counters, setCounters] = useState({
    students: 0,
    employers: 0,
    placements: 0,
    satisfaction: 0,
  });
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          if (entry.target.id === "stats-section") {
            animateCounters();
          }
        }
      });
    }, observerOptions);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  const animateCounters = () => {
    const duration = 2000;
    const steps = 50;
    const targetValues = {
      students: 1000,
      employers: 500,
      placements: 500,
      satisfaction: 99,
    };
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCounters({
        students: Math.floor((targetValues.students / steps) * step),
        employers: Math.floor((targetValues.employers / steps) * step),
        placements: Math.floor((targetValues.placements / steps) * step),
        satisfaction: Math.floor((targetValues.satisfaction / steps) * step),
      });
      if (step === steps) clearInterval(interval);
    }, duration / steps);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-14 mt-8">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Find Your Perfect Student Job
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with employers who value student talent
        </p>
      </div>

      <SearchBar />

      {/* Statistics Section */}
      <section id="stats-section" className="rounded-3xl py-20 bg-white animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCapIcon className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {counters.students}+
              </div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {counters.employers}+
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {counters.placements}+
              </div>
              <div className="text-gray-600">Successful Placements</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {counters.satisfaction}%
              </div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="rounded-3xl py-16 bg-white animate-on-scroll mt-10 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-600 mb-12">
            Trusted By Leading Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[AmazonLogo, NikeLogo, McDonaldsLogo, HarrisLogo, WalmartLogo].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
              >
                <img src={logo} className="h-[70px]"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Categories */}
      <section className="rounded-3xl py-20 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Popular Industries
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((industry, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                  <industry.icon className="w-6 h-6 text-teal-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                  {industry.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Section */}
      <section className=" py-10 animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Hire Top Student Talent
            </h2>
            <p className="text-xl text-gray-600">
              Connect with motivated students and recent graduates ready to
              contribute to your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Targeted Matching
              </h3>
              <p className="text-gray-600">
                Find candidates that perfectly match your requirements through
                our advanced matching system
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Efficient Hiring
              </h3>
              <p className="text-gray-600">
                Streamlined recruitment process saving you time and resources
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600">
                Pre-screened candidates with verified academic credentials
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className=" items-center text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Transform Your Hiring?
            </h3>
            <p className="text-gray-600 mb-8">
              Join thousands of employers who have found their perfect
              candidates through our platform
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 pr-[15%] pl-[15%]">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">99%</div>
                <div className="text-sm text-gray-600">
                  Placement Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">$0</div>
                <div className="text-sm text-gray-600">Cost to hire</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  96hrs
                </div>
                <div className="text-sm text-gray-600">
                  Average Time to Hire
                </div>
              </div>
            </div>
            <button className="max-w-[900px] mx-auto px-8 py-4 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition-all hover:shadow-xl flex items-center justify-center gap-2 text-lg font-semibold">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="rounded-3xl py-20 bg-teal-600 animate-on-scroll">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-teal-100 mb-8">
            Get the latest opportunities and career insights delivered to your
            inbox
          </p>
          <form className="flex gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <Link to="/employer/signup">
            <button className="px-8 py-4 bg-white text-teal-600 rounded-full hover:bg-teal-50 transition-colors font-semibold flex items-center justify-center">
              Subscribe <Send className="w-5 h-5 mx-1"/>
            </button>
            </Link>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default HomePage;
