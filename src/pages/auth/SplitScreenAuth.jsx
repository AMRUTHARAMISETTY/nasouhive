import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const roles = [
  { key: 'manufacturer', title: 'Manufacturer', accent: '#1F5C4A', subtitle: 'Manage production, wholesale orders, and dispatch timelines.', cta: 'Enter Manufacturer Console' },
  { key: 'retailer', title: 'Retailer', accent: '#255849', subtitle: 'Source products, optimize shelves, and track order health.', cta: 'Enter Retailer Workspace' },
  { key: 'customer', title: 'Customer', accent: '#255849', subtitle: 'Track purchases, verify sustainability, and follow provenance.', cta: 'Enter Customer Portal' },
];

const fieldClass = 'w-full rounded-xl border-2 border-[#E5D8C7] bg-white p-3 outline-none ring-primary/30 focus:border-primary focus:ring';

const SplitScreenAuth = () => {
  const [mode, setMode] = useState('login');
  const [activeRole, setActiveRole] = useState('manufacturer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    storeName: '',
    gstNumber: '',
    phone: '',
    address: '',
  });

  const role = useMemo(() => roles.find((item) => item.key === activeRole) ?? roles[0], [activeRole]);
  const showForgotPassword = mode === 'login' && (activeRole === 'manufacturer' || activeRole === 'retailer');

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = () => {
    alert(`Password reset link will be sent to your email (for ${activeRole} account).`);
  };

  const handleSocialLogin = (provider) => {
    alert(`Redirecting to ${provider} authentication...`);
  };

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    alert(`${mode === 'login' ? 'Login' : 'Registration'} captured for ${activeRole}. Portal routes are disabled in this build.`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(31,92,74,0.25),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(37,88,73,0.2),transparent_26%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border-2 border-[#1F5C4A] bg-gradient-to-br from-[#1F5C4A] via-[#1F5C4A] to-[#255849] p-6 text-white shadow-[0_30px_70px_rgba(18,62,49,0.45)] sm:p-8"
        >
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[#E6ECEA]">Live Role Preview</p>
            <h2 className="mt-3 text-3xl font-bold">{role.title} Dashboard Access</h2>
            <p className="mt-3 text-sm leading-6 text-[#E6ECEA]">{role.subtitle}</p>
            <div className="mt-8 space-y-3">
              {[
                ['Realtime visibility', 'Orders, production, and transit state in one screen.'],
                ['Smart actions', 'Recommendations to reduce delays and stockouts.'],
                ['Sustainability trail', 'Track eco attributes through the chain.'],
              ].map(([title, text], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + index * 0.08 }}
                  className="rounded-xl border border-white/25 bg-white/10 p-4"
                >
                  <p className="text-sm font-semibold text-[#FFFFFF]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#E6ECEA]">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card border-2 border-[#E5D8C7] p-6 sm:p-8"
        >
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#255849]/80">Nasuo Hive Access</p>
            <h1 className="mt-2 text-3xl font-bold text-[#1F5C4A] sm:text-4xl">Choose Role and Sign In</h1>
            <p className="mt-3 text-sm text-[#1F5C4A] sm:text-base">Single gateway for manufacturers, retailers, and customers.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {roles.map((item) => {
              const active = item.key === activeRole;
              return (
                <motion.button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveRole(item.key)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-2xl border-2 bg-white p-4 text-left"
                  style={{ borderColor: active ? item.accent : '#E5D8C7' }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: active ? item.accent : '#1F5C4A' }}>{item.title}</p>
                    <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: active ? item.accent : '#255849' }} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#255849]">{item.subtitle}</p>
                  {active && <motion.div layoutId="activeRoleBar" className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: item.accent }} />}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-[#E5D8C7] bg-[#FFFFFF] p-4">
            <div className="mb-4 flex rounded-full bg-[#EFEAE1] p-1">
              <button type="button" onClick={() => setMode('login')} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-primary text-white' : 'text-[#1F5C4A]'}`}>Login</button>
              <button type="button" onClick={() => setMode('register')} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-primary text-white' : 'text-[#1F5C4A]'}`}>Register</button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input name="email" type="email" value={formData.email} onChange={onChange} className={fieldClass} placeholder="Work email" required />
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={onChange} className={`${fieldClass} pr-24`} placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[#E5D8C7] bg-white p-1.5 text-[#1F5C4A]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                      <path d="M16.68 16.67A10.94 10.94 0 0 1 12 18C7 18 2.73 14.89 1 12c.66-1.1 1.62-2.29 2.84-3.34" />
                      <path d="M9.88 5.09A10.95 10.95 0 0 1 12 5c5 0 9.27 3.11 11 7-.51.84-1.18 1.73-2 2.56" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {showForgotPassword && (
                <div className="text-right">
                  <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-[#1F5C4A] hover:underline">Forgot password?</button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div key="registerFields" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
                    {activeRole === 'manufacturer' && (
                      <>
                        <input name="companyName" value={formData.companyName} onChange={onChange} className={fieldClass} placeholder="Company Name" required />
                        <input name="gstNumber" value={formData.gstNumber} onChange={onChange} className={fieldClass} placeholder="GST Number" required />
                        <input name="phone" value={formData.phone} onChange={onChange} className={fieldClass} placeholder="Phone Number" required />
                        <input name="address" value={formData.address} onChange={onChange} className={fieldClass} placeholder="Registered Address" required />
                      </>
                    )}
                    {activeRole === 'retailer' && (
                      <>
                        <input name="storeName" value={formData.storeName} onChange={onChange} className={fieldClass} placeholder="Store Name" required />
                        <input name="gstNumber" value={formData.gstNumber} onChange={onChange} className={fieldClass} placeholder="GST Number" required />
                        <input name="phone" value={formData.phone} onChange={onChange} className={fieldClass} placeholder="Phone Number" required />
                        <input name="address" value={formData.address} onChange={onChange} className={fieldClass} placeholder="Store Address" required />
                      </>
                    )}
                    {activeRole === 'customer' && (
                      <>
                        <input name="fullName" value={formData.fullName} onChange={onChange} className={fieldClass} placeholder="Full Name" required />
                        <input name="phone" value={formData.phone} onChange={onChange} className={fieldClass} placeholder="Phone Number" required />
                      </>
                    )}
                    <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={onChange} className={fieldClass} placeholder="Confirm Password" required />
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === 'register' && (
                <label className="flex items-start gap-2 text-xs text-[#255849]">
                  <input type="checkbox" required className="mt-0.5" />
                  I agree to platform terms and data handling policy.
                </label>
              )}

              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white" style={{ background: `linear-gradient(180deg, ${role.accent}, #1F5C4A)` }}>
                {mode === 'login' ? role.cta : `Create ${role.title} Account`}
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5D8C7]" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-[#FFFFFF] px-2 text-[#255849]">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 rounded-full border-2 border-[#E5D8C7] bg-white py-2.5 text-sm font-semibold text-[#1F5C4A] transition hover:bg-[#EFEAE1]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#255849" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#255849" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#E5D8C7" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#E5D8C7" />
                  </svg>
                  Google
                </button>
                <button type="button" onClick={() => handleSocialLogin('Microsoft')} className="flex items-center justify-center gap-2 rounded-full border-2 border-[#E5D8C7] bg-white py-2.5 text-sm font-semibold text-[#1F5C4A] transition hover:bg-[#EFEAE1]">
                  <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none">
                    <path d="M11 0H0V11H11V0Z" fill="#E5D8C7" />
                    <path d="M23 0H12V11H23V0Z" fill="#E5D8C7" />
                    <path d="M11 12H0V23H11V12Z" fill="#255849" />
                    <path d="M23 12H12V23H23V12Z" fill="#E5D8C7" />
                  </svg>
                  Microsoft
                </button>
              </div>
            </form>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SplitScreenAuth;

