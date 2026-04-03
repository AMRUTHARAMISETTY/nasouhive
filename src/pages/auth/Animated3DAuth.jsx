import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function Animated3DAuth() {
  const state = useAuthForm();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4" style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-8"
      >
        <AuthCoreForm state={state} />
      </motion.div>
    </div>
  );
}
