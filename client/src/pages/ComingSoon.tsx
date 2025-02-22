import Footer from "components/Footer";
import React from "react";

const ComingSoon = () => {
  return (
    <>
      <div className="text-center h-[50vh]">
        <div className="my-20">
        <h1 className="text-4xl font-bold mb-4 text-teal-600">Coming Soon</h1>
        <p className="text-gray-600">
          We're working on something exciting. Stay tuned!
        </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ComingSoon;
