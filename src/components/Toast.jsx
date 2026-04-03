import React from 'react';

const Toast = ({ message }) => {
  if (!message) return null;
  return <div className="fixed top-20 right-4 bg-primary text-white px-4 py-2 rounded-lg">{message}</div>;
};

export default Toast;
