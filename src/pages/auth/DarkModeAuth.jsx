import React from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function DarkModeAuth() {
  const state = useAuthForm();
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-primary-dark/10" />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-black/80 border border-primary/30 rounded-2xl shadow-2xl p-8 backdrop-blur z-10">
        <h2 className="text-2xl text-white font-bold text-center mb-4">Nasuo Hive</h2>
        <AuthCoreForm state={state} dark />
      </motion.div>
    </div>
  );
}
