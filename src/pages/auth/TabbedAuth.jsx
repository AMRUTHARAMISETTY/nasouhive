import React, { useEffect, useState } from 'react';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function TabbedAuth() {
  const state = useAuthForm();
  const [tab, setTab] = useState('login');
  useEffect(() => {
    state.setIsLogin(tab === 'login');
  }, [tab]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex border-b border-beige mb-4">
          <button onClick={() => setTab('login')} className={`flex-1 py-3 ${tab==='login'?'text-primary border-b-2 border-primary':'text-gray-500'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-3 ${tab==='register'?'text-primary border-b-2 border-primary':'text-gray-500'}`}>Register</button>
        </div>
        <AuthCoreForm state={state} tabbed />
      </div>
    </div>
  );
}
