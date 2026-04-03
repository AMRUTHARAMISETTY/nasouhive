import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatbotWidget from './components/ChatbotWidget';
import SplitScreenAuth from './pages/auth/SplitScreenAuth';

function NasuoApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/app/auth" replace />} />
        <Route path="/auth" element={<SplitScreenAuth />} />
        <Route path="/auth/default" element={<SplitScreenAuth />} />
        <Route path="*" element={<Navigate to="/app/auth" replace />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}

export default NasuoApp;
