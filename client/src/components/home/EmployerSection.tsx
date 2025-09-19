import React from "react";
import { Target, Shield, UserPlus } from "lucide-react";

const EmployerSection = () => {
  return (
    <section className=" pt-10 animate-on-scroll">
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

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              AI Matching
            </h3>
            <p className="text-gray-600">
              Find candidates that perfectly match your requirements through
              our suggestion system
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Authentic Reach
            </h3>
            <p className="text-gray-600">
              Creator partnerships connect your business with engaged
              audiences through trusted voices they already follow
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Lasting Community
            </h3>
            <p className="text-gray-600">
              Creator referred customers show higher loyalty and engagement
              than those from traditional advertising
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerSection;
