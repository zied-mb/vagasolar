import React from 'react';

const VagaSpinner = ({ size = "w-5 h-5", className = "" }) => {
  return (
    <div
      className={`${size} border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin ${className}`}
    />
  );
};

export default VagaSpinner;
