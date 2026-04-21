import React from 'react';
import { Navigate } from 'react-router-dom';

function RetailerDashboard() {
  return <Navigate to="/app/retailer/dashboard" replace />;
}

export default RetailerDashboard;
