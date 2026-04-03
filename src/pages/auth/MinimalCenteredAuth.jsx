import React from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function MinimalCenteredAuth() {
  const state = useAuthForm();
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6"><div className="text-primary text-4xl mb-2">AI</div><h2 className="text-2xl font-bold text-primary">Nasuo Hive</h2></div>
        <AuthCoreForm state={state} />
      </motion.div>
    </div>
  );
}
