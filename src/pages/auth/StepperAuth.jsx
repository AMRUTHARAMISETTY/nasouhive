import React, { useState } from 'react';
import { useAuthForm } from './authShared';

export default function StepperAuth() {
  const state = useAuthForm();
  const [step, setStep] = useState(1);
  const { isLogin, setIsLogin, role, setRole, formData, onChange, submit, registerFields } = state;

  if (isLogin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <div className="flex gap-2 mb-4"><button onClick={() => setIsLogin(true)} className="flex-1 py-2 rounded-full bg-primary text-white">Login</button><button onClick={() => setIsLogin(false)} className="flex-1 py-2 rounded-full bg-beige">Sign Up</button></div>
          <form onSubmit={submit} className="space-y-3">
            <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Email" required />
            <input type="password" name="password" value={formData.password} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Password" required />
            <button className="w-full bg-primary text-white py-3 rounded-full">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between mb-6">{[1,2,3].map((s) => <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-primary text-white' : 'bg-gray-200'}`}>{s}</div>)}</div>
        {step === 1 && <div className="space-y-3"><div className="flex gap-2">{['manufacturer','retailer','customer'].map((r) => <button key={r} onClick={() => setRole(r)} className={`flex-1 py-1.5 rounded-full text-sm capitalize ${role===r?'bg-primary-dark text-white':'bg-gray-100'}`}>{r}</button>)}</div><input type="email" name="email" value={formData.email} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Email" required /><input type="password" name="password" value={formData.password} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Password" required /><button onClick={() => setStep(2)} className="w-full bg-primary text-white py-2 rounded-full">Next</button></div>}
        {step === 2 && <div className="space-y-3"><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder="Confirm Password" required />{registerFields.map((f) => <input key={f} name={f} value={formData[f]} onChange={onChange} className="w-full p-3 rounded-xl border border-beige" placeholder={f} required />)}<div className="flex gap-2"><button onClick={() => setStep(1)} className="flex-1 py-2 rounded-full bg-beige">Back</button><button onClick={() => setStep(3)} className="flex-1 py-2 rounded-full bg-primary text-white">Next</button></div></div>}
        {step === 3 && <form onSubmit={submit} className="space-y-3"><p className="text-sm">Review and submit registration.</p><div className="flex gap-2"><button type="button" onClick={() => setStep(2)} className="flex-1 py-2 rounded-full bg-beige">Back</button><button type="submit" className="flex-1 py-2 rounded-full bg-primary text-white">Create Account</button></div></form>}
      </div>
    </div>
  );
}
