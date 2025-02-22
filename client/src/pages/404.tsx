import React from "react";
import { HomeIcon, AlertCircle } from "lucide-react";

const FourZeroFour = () => {
  return (
    <div className="max-w-lg mx-auto px-6 py-12 text-center">
      <div className="mb-8 flex justify-center">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <AlertCircle className="w-12 h-12 text-teal-600" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-teal-600">404</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <HomeIcon className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default FourZeroFour;
