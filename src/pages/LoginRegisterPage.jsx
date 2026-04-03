import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    accent: '#1F5C4A',
    subtitle: 'Manage production, wholesale orders, and dispatch timelines.',
    cta: 'Enter Manufacturer Console',
  },
  {
    key: 'retailer',
    title: 'Retailer',
    accent: '#255849',
    subtitle: 'Source products, optimize shelves, and track order health.',
    cta: 'Enter Retailer Workspace',
  },
  {
    key: 'customer',
    title: 'Customer',
    accent: '#406F60',
    subtitle: 'Track purchases, verify sustainability, and follow provenance.',
    cta: 'Enter Customer Portal',
  },
];

const LoginRegisterPage = () => {
  const [mode, setMode] = useState('login');
  const [activeRole, setActiveRole] = useState('manufacturer');
  const [showPassword, setShowPassword] = useState(false);

  const role = useMemo(() => roles.find((item) => item.key === activeRole) ?? roles[0], [activeRole]);

  const submit = (e) => {
    e.preventDefault();
    alert(`${mode === 'login' ? 'Login' : 'Registration'} captured for ${activeRole}. Portal routes are disabled in this build.`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(31,92,74,0.2),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(229,216,199,0.65),transparent_28%),radial-gradient(circle_at_55%_80%,rgba(64,111,96,0.18),transparent_30%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 sm:p-8"
        >
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#255849]/70">Nasuo Hive Access</p>
            <h1 className="mt-2 text-3xl font-bold text-[#25483c] sm:text-4xl">Choose Role and Sign In</h1>
            <p className="mt-3 text-sm text-[#4f635b] sm:text-base">Single gateway for manufacturers, retailers, and customers.</p>
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
                  className="relative overflow-hidden rounded-2xl border bg-white/70 p-4 text-left"
                  style={{ borderColor: active ? item.accent : 'rgba(37, 88, 73, 0.15)' }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: active ? item.accent : '#35584b' }}>{item.title}</p>
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: active ? item.accent : 'rgba(37,88,73,0.3)' }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#5a6d65]">{item.subtitle}</p>
                  {active && (
                    <motion.div
                      layoutId="activeRoleBar"
                      className="absolute inset-x-0 bottom-0 h-1"
                      style={{ backgroundColor: item.accent }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-white/40 bg-white/55 p-4">
            <div className="mb-4 flex rounded-full bg-white/70 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`w-1/2 rounded-full py-2 text-sm font-medium transition ${mode === 'login' ? 'bg-primary text-white' : 'text-[#35584b]'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`w-1/2 rounded-full py-2 text-sm font-medium transition ${mode === 'register' ? 'bg-primary text-white' : 'text-[#35584b]'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <AnimatePresence mode="wait">
                {mode === 'register' ? (
                  <motion.div
                    key="registerFields"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <input className="w-full rounded-xl bg-white/80 p-3 outline-none ring-primary/30 focus:ring" placeholder="Full name" required />
                    <input className="w-full rounded-xl bg-white/80 p-3 outline-none ring-primary/30 focus:ring" placeholder="Organization (optional)" />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <input type="email" className="w-full rounded-xl bg-white/80 p-3 outline-none ring-primary/30 focus:ring" placeholder="Work email" required />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-xl bg-white/80 p-3 pr-24 outline-none ring-primary/30 focus:ring"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-xs text-[#35584b]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {mode === 'register' && (
                <label className="flex items-start gap-2 text-xs text-[#546760]">
                  <input type="checkbox" required className="mt-0.5" />
                  I agree to platform terms and data handling policy.
                </label>
              )}

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(180deg, ${role.accent}, #163d31)` }}
              >
                {mode === 'login' ? role.cta : `Create ${role.title} Account`}
              </motion.button>
            </form>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="glass-card relative overflow-hidden p-6 sm:p-8"
        >
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl" style={{ background: `${role.accent}55` }} />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[#255849]/70">Live Role Preview</p>
            <h2 className="mt-2 text-2xl font-bold text-[#25483c]">{role.title} Dashboard Access</h2>
            <p className="mt-3 text-sm leading-6 text-[#566861]">{role.subtitle}</p>

            <div className="mt-6 space-y-3">
              {[
                ['Realtime visibility', 'Orders, production, and transit state in one screen.'],
                ['Smart actions', 'Recommendations to reduce delays and stockouts.'],
                ['Sustainability trail', 'Track eco attributes through the chain.'],
              ].map(([title, text], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + index * 0.08 }}
                  className="rounded-xl border border-white/40 bg-white/65 p-4"
                >
                  <p className="text-sm font-semibold" style={{ color: role.accent }}>{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#5a6d65]">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
