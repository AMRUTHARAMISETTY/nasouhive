import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from './authShared';

export default function SocialAuth() {
  const state = useAuthForm();
  const { setIsLogin, setRole, submit, formData, onChange } = state;
  useEffect(() => {
    setIsLogin(true);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Nasuo Hive</h2>
        <p className="text-gray-500 mb-6">Continue with</p>
        <div className="space-y-3 mb-6">
          <button className="w-full border rounded-full py-3">Continue with Google</button>
          <button className="w-full border rounded-full py-3">Continue with LinkedIn</button>
        </div>
        <div className="my-4 text-gray-400">or</div>
        <div className="flex gap-2 mb-3">{['manufacturer','retailer','customer'].map((r) => <button key={r} onClick={() => setRole(r)} className="flex-1 py-1.5 rounded-full text-sm capitalize bg-beige">{r}</button>)}</div>
        <form onSubmit={submit} className="space-y-3 text-left">
          <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Email" required />
          <input type="password" name="password" value={formData.password} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Password" required />
          <motion.button whileHover={{ scale: 1.02 }} type="submit" className="w-full bg-primary text-white rounded-full py-3">Sign in with Email</motion.button>
        </form>
      </div>
    </div>
  );
}
