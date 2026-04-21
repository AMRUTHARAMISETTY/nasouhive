import React from 'react';
import { Navigate } from 'react-router-dom';

function ManufacturerDashboard() {
  return <Navigate to="/app/manufacturer/dashboard" replace />;
}

export default ManufacturerDashboard;
