import React from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function GlassmorphismAuth() {
  const state = useAuthForm();
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-20 -left-20 animate-pulse" />
      <div className="absolute w-80 h-80 bg-primary-dark/20 rounded-full blur-3xl bottom-20 -right-20 animate-pulse" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md glass-card p-8 z-10">
        <AuthCoreForm state={state} />
      </motion.div>
    </div>
  );
}
