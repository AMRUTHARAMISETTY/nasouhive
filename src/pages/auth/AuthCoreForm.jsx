import React from 'react';
import { motion } from 'framer-motion';
import { ROLE_OPTIONS, fieldMeta } from './authShared';

const baseInput = 'w-full p-3 rounded-xl border border-beige bg-white/80 outline-none focus:ring-2 focus:ring-primary/30';

export default function AuthCoreForm({ state, compact = false, dark = false, tabbed = false }) {
  const { isLogin, setIsLogin, role, setRole, formData, onChange, submit, registerFields } = state;

  const inputClass = dark
    ? 'w-full p-3 rounded-xl bg-black/40 border border-primary/30 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/60'
    : baseInput;

  return (
    <form onSubmit={submit} className="space-y-3">
      {!tabbed && (
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-full ${isLogin ? 'bg-primary text-white' : dark ? 'bg-white/10 text-white' : 'bg-beige'}`}>Login</button>
          <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-full ${!isLogin ? 'bg-primary text-white' : dark ? 'bg-white/10 text-white' : 'bg-beige'}`}>Sign Up</button>
        </div>
      )}

      <div className="flex gap-2 mb-2">
        {ROLE_OPTIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-1.5 rounded-full text-sm capitalize ${role === r ? 'bg-primary-dark text-white' : dark ? 'bg-white/10 text-white' : 'bg-gray-100'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} className={inputClass} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className={inputClass} required />

      {!isLogin && (
        <>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={onChange} className={inputClass} required />
          {registerFields.map((key) => {
            const meta = fieldMeta[key];
            if (key === 'address') {
              return <textarea key={key} name={key} placeholder={meta.label} value={formData[key]} onChange={onChange} className={inputClass} rows={compact ? 2 : 3} required />;
            }
            return <input key={key} type={meta.type} name={key} placeholder={meta.label} value={formData[key]} onChange={onChange} className={inputClass} required />;
          })}
        </>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-primary text-white py-3 rounded-full font-semibold mt-2">
        {isLogin ? 'Login' : 'Create Account'}
      </motion.button>
    </form>
  );
}
