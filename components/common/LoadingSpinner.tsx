
import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center space-y-4 p-4">
    <div className="w-12 h-12 border-4 border-t-violet-400 border-r-violet-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    <p className="text-violet-300 font-fantasy">{text}</p>
  </div>
);

export default LoadingSpinner;
