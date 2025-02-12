import React from "react";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Send,
  X,
  CalendarDays,
  Clock,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

const JobModal = ({ job, onClose }: { job: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-teal-600 mb-2">
                Retail Associate
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>Local Bookstore</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span>$15-18/hr</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <Briefcase className="w-4 h-4" />
              <span>Part-time</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span>20-25 hrs/week</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">
              We're seeking an enthusiastic Retail Associate to join our
              bookstore team. You'll assist customers in finding books, manage
              inventory, operate the cash register, and help create an inviting
              atmosphere for book lovers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="space-y-3">
              {[
                "High school diploma or equivalent",
                "Strong customer service skills",
                "Basic computer literacy",
                "Ability to lift up to 25 pounds",
                "Weekend availability",
              ].map((req, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Schedule</h3>
            <div className="flex flex-wrap gap-3">
              {[
                "Monday: 9AM - 2PM",
                "Wednesday: 9AM - 2PM",
                "Saturday: 10AM - 4PM",
              ].map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-gray-600"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{schedule}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-5 h-5" />
              <span>High School Diploma or equivalent</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-500 transition-all duration-300 font-medium flex items-center justify-center gap-2">
            Apply Now
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
