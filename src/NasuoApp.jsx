import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatbotWidget from './components/ChatbotWidget';
import CustomerPortal from './pages/CustomerPortal';
import LoginRegisterPage from './pages/LoginRegisterPage';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import RoleSelectionPage from './pages/RoleSelectionPage';

function NasuoApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/app/auth" replace />} />
        <Route path="/auth" element={<RoleSelectionPage />} />
        <Route path="/auth/default" element={<Navigate to="/app/auth" replace />} />
        <Route path="/auth/:roleKey" element={<LoginRegisterPage />} />
        <Route path="/customer" element={<CustomerPortal />} />
        <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/retailer" element={<RetailerDashboard />} />
        <Route path="*" element={<Navigate to="/app/auth" replace />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}

export default NasuoApp;
