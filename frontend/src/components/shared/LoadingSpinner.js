import React from "react";

const LoadingSpinner = ({ size = "8", color = "blue-500" }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-4 border-${color} border-opacity-75 h-${size} w-${size}`}
        style={{
          borderTopColor: `var(--tw-color-${color})`,
          borderRightColor: `transparent`,
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
