import React from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function MobileFirstAuth() {
  const state = useAuthForm();
  return (
    <div className="min-h-screen bg-cream flex items-end md:items-center justify-center p-4">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-xl p-6">
        <AuthCoreForm state={state} compact />
      </motion.div>
    </div>
  );
}
