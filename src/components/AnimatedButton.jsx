import React from 'react';

const AnimatedButton = ({ children, className = '', onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary text-white py-2.5 px-4 rounded-full hover:bg-primary-dark transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
