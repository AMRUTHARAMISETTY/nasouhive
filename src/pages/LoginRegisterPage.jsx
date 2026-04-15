import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    accent: '#1F5C4A',
    subtitle: 'Manage production, wholesale orders, and dispatch timelines.',
    cta: 'Enter Manufacturer Console',
    registerFields: [
      { name: 'companyName', label: 'Company Name', placeholder: 'Company name', type: 'text' },
      { name: 'nationalId', label: 'National ID', placeholder: 'Upload national ID', type: 'file', accept: '.pdf,.jpg,.jpeg,.png' },
      { name: 'warehouseLocation', label: 'Warehouse Location', placeholder: 'Warehouse location', type: 'text' },
    ],
  },
  {
    key: 'retailer',
    title: 'Retailer',
    accent: '#255849',
    subtitle: 'Source products, optimize shelves, and track order health.',
    cta: 'Enter Retailer Workspace',
    registerFields: [
      { name: 'shopName', label: 'Shop Name', placeholder: 'Shop name', type: 'text' },
      { name: 'gstNumber', label: 'GST Number', placeholder: 'GST number', type: 'text' },
      { name: 'storeAddress', label: 'Store Address', placeholder: 'Store address', type: 'text' },
    ],
  },
  {
    key: 'customer',
    title: 'Customer',
    accent: '#406F60',
    subtitle: 'Track purchases, verify sustainability, and follow provenance.',
    cta: 'Enter Customer Portal',
    registerFields: [
      { name: 'address', label: 'Address', placeholder: 'Address', type: 'text' },
      { name: 'city', label: 'City', placeholder: 'City', type: 'text' },
      { name: 'pincode', label: 'Pincode', placeholder: 'Pincode', type: 'text' },
    ],
  },
];

const baseInputClass =
  'w-full rounded-xl border bg-white/90 p-3 text-sm text-[#26483c] outline-none transition focus:ring-2';

const initialFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  nationalId: null,
  warehouseLocation: '',
  shopName: '',
  gstNumber: '',
  storeAddress: '',
  address: '',
  city: '',
  pincode: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginRegisterPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });

  const role = useMemo(() => roles.find((item) => item.key === roleKey), [roleKey]);

  if (!role) {
    return <Navigate to="/app/auth" replace />;
  }

  const getFieldError = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) return 'Email is required.';
      if (!emailPattern.test(value)) return 'Enter a valid email address.';
    }

    if (name === 'password') {
      if (!value) return 'Password is required.';
      if (value.length < 8) return 'Password must be at least 8 characters.';
    }

    if (name === 'confirmPassword') {
      if (mode !== 'register') return '';
      if (!value) return 'Please confirm your password.';
      if (value !== formData.password) return 'Passwords do not match.';
    }

    if (name === 'gstNumber' && mode === 'register' && !value.trim()) {
      return 'GST number is required.';
    }

    if (name === 'pincode' && mode === 'register') {
      if (!value.trim()) return 'Pincode is required.';
      if (!/^\d{6}$/.test(value.trim())) return 'Pincode must be 6 digits.';
    }

    if (name === 'nationalId' && mode === 'register') {
      if (!value) return 'National ID upload is required.';
    }

    const roleField = role.registerFields.find((field) => field.name === name);
    if (mode === 'register' && roleField && roleField.type !== 'file' && !String(value ?? '').trim()) {
      return `${roleField.label} is required.`;
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors = {};
    ['email', 'password'].forEach((field) => {
      const message = getFieldError(field, formData[field]);
      if (message) nextErrors[field] = message;
    });

    if (mode === 'register') {
      ['confirmPassword', ...role.registerFields.map((field) => field.name)].forEach((field) => {
        const message = getFieldError(field, formData[field]);
        if (message) nextErrors[field] = message;
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', message: '' });
    setErrors((prev) => {
      const next = { ...prev };
      const message = getFieldError(name, value);
      if (message) next[name] = message;
      else delete next[name];

      if (name === 'password' && mode === 'register' && prev.confirmPassword) {
        const confirmMessage = getFieldError('confirmPassword', formData.confirmPassword);
        if (confirmMessage) next.confirmPassword = confirmMessage;
        else delete next.confirmPassword;
      }

      return next;
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    updateField('nationalId', file);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setStatus({ type: '', message: '' });
  };

  const submit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateForm()) {
      setStatus({
        type: 'error',
        message: `Please fix the highlighted ${mode === 'login' ? 'login' : 'registration'} fields.`,
      });
      return;
    }

    setStatus({
      type: 'success',
      message:
        mode === 'login'
          ? `${role.title} login details look good. Authentication flow is still mocked in this build.`
          : `${role.title} account details validated successfully. Account creation is still mocked in this build.`,
    });

    if (role.key === 'manufacturer') {
      window.setTimeout(() => navigate('/app/manufacturer'), 700);
    }

    if (role.key === 'retailer') {
      window.setTimeout(() => navigate('/app/retailer'), 700);
    }

    if (role.key === 'customer') {
      window.setTimeout(() => navigate('/app/customer'), 700);
    }
  };

  const inputClass = (name) =>
    `${baseInputClass} ${
      errors[name]
        ? 'border-[#c66d5c] bg-[#fff5f1] focus:border-[#c66d5c] focus:ring-[#e7b0a5]'
        : 'border-white/50 focus:border-[#1F5C4A] focus:ring-[#1F5C4A]/20'
    }`;

  const renderError = (name) =>
    errors[name] ? <p className="mt-1 text-xs font-medium text-[#b85f4e]">{errors[name]}</p> : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(31,92,74,0.2),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(229,216,199,0.65),transparent_28%),radial-gradient(circle_at_55%_80%,rgba(64,111,96,0.18),transparent_30%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#1d5a49_0%,#1a4c3d_100%)] p-8 text-white shadow-[0_28px_70px_rgba(20,61,49,0.28)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.08),transparent_20%)]" />
          <div className="relative flex h-full min-h-[320px] flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#dbe9e3]">Nasuo Hive</p>
            <h1 className="mt-6 text-5xl font-bold tracking-[-0.04em]">Nasuo Hive</h1>
            <p className="mt-5 text-2xl font-semibold text-[#eef5f1]">Smart Supply Chain Platform</p>
            <p className="mt-4 max-w-md text-base leading-7 text-[#d4e4dd]">
              Connect, trade, and grow sustainably with a role-aware access flow for manufacturers, retailers, and customers.
            </p>
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card border border-[#e2d8ca] p-6 sm:p-8"
        >
          <div className="mb-5">
            <Link to="/app/auth" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#255849]/80 transition hover:text-[#173c31]">
              <span aria-hidden="true">&lt;</span>
              Change role
            </Link>
          </div>

          <div className="rounded-[30px] bg-[#fffaf4] p-4 sm:p-5">
            <div className="mb-4 flex rounded-full bg-[#efe7dc] p-1">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`w-1/2 rounded-full py-2.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-primary text-white' : 'text-[#35584b]'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`w-1/2 rounded-full py-2.5 text-sm font-semibold transition ${mode === 'register' ? 'bg-primary text-white' : 'text-[#35584b]'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="mb-5 inline-flex rounded-full bg-[#efe7dc] p-1 text-xs font-semibold text-[#35584b]">
              <span className="rounded-full bg-primary px-4 py-2 text-white">{role.title}</span>
            </div>

            <div className="mb-5">
              <p className="text-xl font-semibold text-[#25483c]">{mode === 'login' ? `Login to ${role.title}` : `Register as ${role.title}`}</p>
              <p className="mt-2 text-sm text-[#62736c]">{role.subtitle}</p>
            </div>

            <AnimatePresence mode="wait">
              {status.message ? (
                <motion.div
                  key={status.type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                    status.type === 'error'
                      ? 'border-[#e2b1a7] bg-[#fff2ef] text-[#8f4335]'
                      : 'border-[#b8d5c8] bg-[#eef8f2] text-[#215642]'
                  }`}
                >
                  {status.message}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  className={inputClass('email')}
                  placeholder="Email"
                />
                {renderError('email')}
              </div>

              <div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleTextChange}
                    className={`${inputClass('password')} pr-20`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#35584b]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {renderError('password')}
              </div>

              <AnimatePresence mode="wait">
                {mode === 'register' ? (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleTextChange}
                          className={`${inputClass('confirmPassword')} pr-20`}
                          placeholder="Confirm Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#35584b]"
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {renderError('confirmPassword')}
                    </div>

                    {role.registerFields.map((field) => (
                      <div key={field.name}>
                        {field.type === 'file' ? (
                          <label
                            className={`block rounded-xl border border-dashed p-3 text-sm transition ${
                              errors[field.name]
                                ? 'border-[#c66d5c] bg-[#fff5f1] text-[#8f4335]'
                                : 'border-[#d9cebf] bg-white/90 text-[#35584b]'
                            }`}
                          >
                            <span className="mb-2 block font-medium">{field.label}</span>
                            <input
                              name={field.name}
                              type="file"
                              accept={field.accept}
                              onChange={handleFileChange}
                              className="w-full text-sm text-[#35584b] file:mr-3 file:rounded-full file:border-0 file:bg-[#e8efe9] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#1F5C4A]"
                            />
                            <span className="mt-2 block text-xs text-[#62736c]">
                              {formData.nationalId ? formData.nationalId.name : 'PDF, JPG, or PNG up to your browser limits.'}
                            </span>
                          </label>
                        ) : (
                          <input
                            name={field.name}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={handleTextChange}
                            className={inputClass(field.name)}
                            placeholder={field.placeholder}
                          />
                        )}
                        {renderError(field.name)}
                      </div>
                    ))}

                    <p className="text-sm text-[#62736c]">
                      Already have an account?{' '}
                      <button type="button" onClick={() => handleModeChange('login')} className="font-semibold text-[#1F5C4A] hover:underline">
                        Login page
                      </button>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login-link"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm text-[#62736c]">
                      New to Nasuo Hive?{' '}
                      <button type="button" onClick={() => handleModeChange('register')} className="font-semibold text-[#1F5C4A] hover:underline">
                        Create an account
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full rounded-full px-5 py-3.5 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(180deg, ${role.accent}, #163d31)` }}
              >
                {mode === 'login' ? role.cta : 'Create Account'}
              </motion.button>
            </form>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
