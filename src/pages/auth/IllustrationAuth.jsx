import React from 'react';
import { useAuthForm } from './authShared';
import AuthCoreForm from './AuthCoreForm';

export default function IllustrationAuth() {
  const state = useAuthForm();
  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row items-center justify-center p-6 gap-8">
      <div className="text-center md:w-1/2">
        <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-white/70 text-7xl">AI</div>
        <h2 className="text-2xl font-bold text-primary mt-4">Join the Hive</h2>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"><AuthCoreForm state={state} /></div>
    </div>
  );
}
