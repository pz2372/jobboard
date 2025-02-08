import React from "react";

const LoadingIcon = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-16 h-16 animate-squares"
          style={{
            animationDelay: `${i * 0.2}s`,
            border: "2px solid",
            borderColor: `rgba(13, 148, 136, ${0.3 + i * 0.2})`,
            backgroundColor: `rgba(13, 148, 136, ${0.05 + i * 0.05})`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingIcon;
