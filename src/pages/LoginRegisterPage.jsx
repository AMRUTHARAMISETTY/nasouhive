import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    accent: '#1F5C4A',
    accentSoft: '#E6ECEA',
    subtitle: 'Manage production, wholesale orders, and dispatch timelines.',
    cta: 'Enter Manufacturer Console',
    icon: 'factory',
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
    accentSoft: '#E5D8C7',
    subtitle: 'Source products, optimize shelves, and track order health.',
    cta: 'Enter Retailer Workspace',
    icon: 'retail',
    registerFields: [
      { name: 'shopName', label: 'Shop Name', placeholder: 'Shop name', type: 'text' },
      { name: 'gstNumber', label: 'GST Number', placeholder: 'GST number', type: 'text' },
      { name: 'storeAddress', label: 'Store Address', placeholder: 'Store address', type: 'text' },
    ],
  },
  {
    key: 'customer',
    title: 'Customer',
    accent: '#1F5C4A',
    accentSoft: '#EFEAE1',
    subtitle: 'Track purchases, verify sustainability, and follow provenance.',
    cta: 'Enter Customer Portal',
    icon: 'user',
    registerFields: [
      { name: 'address', label: 'Address', placeholder: 'Address', type: 'text' },
      { name: 'city', label: 'City', placeholder: 'City', type: 'text' },
      { name: 'pincode', label: 'Pincode', placeholder: 'Pincode', type: 'text' },
    ],
  },
];

const initialFormState = {
  email: '',
  forgotContact: '',
  password: '',
  confirmPassword: '',
  newPassword: '',
  resetConfirmPassword: '',
  otp: '',
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
const mobilePattern = /^\d{10}$/;
const locationFieldNames = new Set(['warehouseLocation', 'storeAddress', 'address']);

const openGoogleMaps = (locationValue = '') => {
  const query = String(locationValue ?? '').trim();
  const url = query ? `https://www.google.com/maps/search/${encodeURIComponent(query)}` : 'https://www.google.com/maps';
  window.open(url, '_blank', 'noopener,noreferrer');
};

function PortalIcon({ name, accent, small = false }) {
  const common = {
    className: small ? 'h-5 w-5' : 'h-6 w-6',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: accent,
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    factory: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V10l5 3V8l5 3V6l4 2v13" />
        <path d="M9 21v-4" />
        <path d="M13 21v-3" />
        <path d="M17 21v-5" />
      </>
    ),
    retail: (
      <>
        <path d="M4 7h16" />
        <path d="M6 7l1.2-3h9.6L18 7" />
        <path d="M6 10v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" />
        <path d="M10 14h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19a7 7 0 0 1 14 0" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function FloatingParticle({ delay, duration, left, top }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute h-[3px] w-[3px] rounded-full bg-[#FFFFFF]/25"
      style={{ left, top }}
      animate={{ y: [0, -200], x: [0, 40], opacity: [0, 0.4, 0.18, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function FloatingPanel({ className, animate, duration }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={animate}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    />
  );
}

function BackgroundShape({ className, animate, duration, delay = 0, style }) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={style}
      animate={animate}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

const LoginRegisterPage = () => {
  const { roleKey } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loginMethod, setLoginMethod] = useState('password');
  const [registerStep, setRegisterStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  const role = useMemo(() => roles.find((item) => item.key === roleKey), [roleKey]);

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [otpCooldown]);

  if (!role) {
    return <Navigate to="/app/auth" replace />;
  }

  const getFieldError = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) return 'Email is required.';
      if (!emailPattern.test(value)) return 'Enter a valid email address.';
    }

    if (name === 'forgotContact') {
      const contact = value.trim();
      if (!contact) return 'Email or mobile number is required.';
      if (!emailPattern.test(contact) && !mobilePattern.test(contact)) {
        return 'Enter a valid email or 10 digit mobile number.';
      }
    }

    if (name === 'password') {
      if (mode === 'login' && loginMethod !== 'password') return '';
      if (!value) return 'Password is required.';
      if (value.length < 8) return 'Password must be at least 8 characters.';
    }

    if (name === 'newPassword') {
      if (!(mode === 'login' && loginMethod === 'forgot' && forgotOtpSent)) return '';
      if (!value) return 'New password is required.';
      if (value.length < 8) return 'New password must be at least 8 characters.';
    }

    if (name === 'resetConfirmPassword') {
      if (!(mode === 'login' && loginMethod === 'forgot' && forgotOtpSent)) return '';
      if (!value) return 'Please confirm your new password.';
      if (value !== formData.newPassword) return 'New passwords do not match.';
    }

    if (name === 'otp' && mode === 'login' && loginMethod !== 'password') {
      if (!value.trim()) return 'OTP is required.';
      if (!/^\d{4,6}$/.test(value.trim())) return 'Enter a valid OTP.';
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

    if (mode === 'login' && loginMethod === 'forgot') {
      ['forgotContact', ...(forgotOtpSent ? ['otp', 'newPassword', 'resetConfirmPassword'] : [])].forEach((field) => {
        const message = getFieldError(field, formData[field]);
        if (message) nextErrors[field] = message;
      });

      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    ['email', ...(mode === 'login' && loginMethod !== 'password' ? ['otp'] : ['password'])].forEach((field) => {
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

  const validateRegisterBasics = () => {
    const nextErrors = {};

    ['email', 'password', 'confirmPassword'].forEach((field) => {
      const message = getFieldError(field, formData[field]);
      if (message) nextErrors[field] = message;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (name, value) => {
    if (name === 'forgotContact') {
      setForgotOtpSent(false);
      setOtpCooldown(0);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', message: '' });
    setErrors((prev) => {
      const next = { ...prev };
      const message = getFieldError(name, value);
      if (message) next[name] = message;
      else delete next[name];

      if (name === 'password' && mode === 'register') {
        const confirmMessage = getFieldError('confirmPassword', formData.confirmPassword);
        if (confirmMessage) next.confirmPassword = confirmMessage;
        else delete next.confirmPassword;
      }

      if (name === 'newPassword' && mode === 'login' && loginMethod === 'forgot') {
        const resetConfirmMessage = getFieldError('resetConfirmPassword', formData.resetConfirmPassword);
        if (resetConfirmMessage) next.resetConfirmPassword = resetConfirmMessage;
        else delete next.resetConfirmPassword;
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
    setLoginMethod('password');
    setRegisterStep(1);
    setForgotOtpSent(false);
    setOtpCooldown(0);
    setErrors({});
    setStatus({ type: '', message: '' });
  };

  const handleRegisterNext = () => {
    setStatus({ type: '', message: '' });

    if (!validateRegisterBasics()) {
      setStatus({ type: 'error', message: 'Please complete the basic account details first.' });
      return;
    }

    setRegisterStep(2);
    setErrors({});
  };

  const handleGoogleContinue = () => {
    setStatus({
      type: 'success',
      message: `${role.title} Google sign-in is mocked in this build, but the shared flow is now available for this role.`,
    });
  };

  const handleSendOtp = () => {
    if (otpCooldown > 0) return;

    const fieldName = loginMethod === 'forgot' ? 'forgotContact' : 'email';
    const fieldLabel = loginMethod === 'forgot' ? 'email or mobile number' : 'email';
    const emailMessage = getFieldError(fieldName, formData[fieldName]);
    if (emailMessage) {
      setErrors((prev) => ({ ...prev, [fieldName]: emailMessage }));
      setStatus({ type: 'error', message: `Enter a valid ${fieldLabel} before requesting OTP.` });
      return;
    }

    if (loginMethod === 'forgot') {
      setForgotOtpSent(true);
    }
    setOtpCooldown(45);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setStatus({
      type: 'success',
      message: loginMethod === 'forgot' ? 'Reset OTP sent. Enter the code and set a new password.' : 'Login OTP sent. Use the code to continue.',
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (mode === 'register' && registerStep === 1) {
      handleRegisterNext();
      return;
    }

    if (mode === 'login' && loginMethod === 'forgot' && !forgotOtpSent) {
      const contactMessage = getFieldError('forgotContact', formData.forgotContact);
      if (contactMessage) {
        setErrors((prev) => ({ ...prev, forgotContact: contactMessage }));
        setStatus({ type: 'error', message: 'Enter your email or mobile number and request OTP first.' });
        return;
      }

      setStatus({ type: 'error', message: 'Please click Send OTP before setting a new password.' });
      return;
    }

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
        mode === 'login' && loginMethod === 'otp'
          ? `${role.title} OTP login is mocked in this build, but the OTP flow is now available for this role.`
          : mode === 'login' && loginMethod === 'forgot'
          ? `New password saved for ${role.title}. Password reset is mocked in this build.`
          : mode === 'login'
          ? `${role.title} login details look good. Authentication flow is still mocked in this build.`
          : `${role.title} account details validated successfully. Account creation is still mocked in this build.`,
    });

    if (mode === 'login' && loginMethod === 'forgot') return;

    if (role.key === 'manufacturer') window.setTimeout(() => navigate('/app/manufacturer'), 700);
    if (role.key === 'retailer') window.setTimeout(() => navigate('/app/retailer'), 700);
    if (role.key === 'customer') window.setTimeout(() => navigate('/app/customer'), 700);
  };

  const inputClass = (name) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
      errors[name]
        ? 'border-[#1F5C4A] bg-[#EFEAE1] text-[#1F5C4A] focus:border-[#1F5C4A] focus:shadow-[0_0_0_2px_rgba(31,92,74,0.18)]'
        : 'border-[#E5D8C7] bg-[#FFFFFF]/80 text-[#1F5C4A] focus:border-[#1F5C4A] focus:shadow-[0_8px_25px_rgba(37,88,73,0.14),0_0_0_2px_rgba(31,92,74,0.18)]'
    }`;

  const renderError = (name) =>
    errors[name] ? <p className="mt-1 text-xs font-medium text-[#E5D8C7]">{errors[name]}</p> : null;

  return (
    <div className="relative box-border h-screen overflow-y-auto bg-[#EFEAE1] text-[#1F5C4A]">
      <div className="relative z-10 flex min-h-full items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/app/auth"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#255849] transition hover:-translate-x-1 hover:text-[#1F5C4A]"
          >
            <span aria-hidden="true">&lt;</span>
            <span>Back to roles</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-[22px] bg-[#FFFFFF] p-8 shadow-[0_24px_48px_rgba(37,88,73,0.12)]"
          >
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{ background: `${role.accent}22`, borderColor: `${role.accent}55` }}
                >
                  <PortalIcon name={role.icon} accent={role.accent} small />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#255849]">Signing in as</div>
                  <div className="font-semibold" style={{ color: role.accent }}>{role.title}</div>
                </div>
              </div>

              <div className="mb-8 flex gap-1 rounded-xl bg-[#E6ECEA] p-1 shadow-[inset_0_0_0_1px_rgba(37,88,73,0.08)]">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-[#1F5C4A] text-[#FFFFFF] shadow-[0_10px_24px_rgba(31,92,74,0.18)]' : 'text-[#255849]'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('register')}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'register' ? 'bg-[#1F5C4A] text-[#FFFFFF] shadow-[0_10px_24px_rgba(31,92,74,0.18)]' : 'text-[#255849]'}`}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-2xl font-bold text-[#1F5C4A]">
                {mode === 'login' && loginMethod === 'otp'
                  ? 'Login with OTP'
                  : mode === 'login' && loginMethod === 'forgot'
                  ? 'Forgot password'
                  : mode === 'login'
                  ? 'Welcome back'
                  : 'Create account'}
              </h2>
              <p className="mt-1 text-sm text-[#255849]">
                {mode === 'login' && loginMethod === 'otp'
                  ? 'Use a one-time password to continue'
                  : mode === 'login' && loginMethod === 'forgot'
                  ? 'Request a reset OTP and continue securely'
                  : mode === 'login'
                  ? 'Enter your credentials'
                  : registerStep === 1
                  ? 'Step 1 of 2 - create your login details'
                  : `Step 2 of 2 - add ${role.title.toLowerCase()} details`}
              </p>

              <AnimatePresence mode="wait">
                {status.message ? (
                  <motion.div
                    key={status.type}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                      status.type === 'error'
                        ? 'border-[#1F5C4A] bg-[#EFEAE1] text-[#1F5C4A]'
                        : 'border-[#1F5C4A] bg-[#255849] text-[#FFFFFF]'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {!(mode === 'register' && registerStep === 2) ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleTextChange}
                      placeholder="you@example.com"
                      className={inputClass('email')}
                    />
                    {renderError('email')}
                  </div>
                ) : null}

                {mode === 'login' && loginMethod !== 'password' ? (
                  loginMethod === 'forgot' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                          Email or Mobile
                        </label>
                        <input
                          name="forgotContact"
                          type="text"
                          value={formData.forgotContact}
                          onChange={handleTextChange}
                          placeholder="Email or mobile number"
                          className={inputClass('forgotContact')}
                        />
                        {renderError('forgotContact')}
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpCooldown > 0}
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-bold transition ${
                          otpCooldown > 0
                            ? 'cursor-not-allowed border-[#E5D8C7] bg-[#E6ECEA] text-[#255849]/45 blur-[0.2px]'
                            : 'border-[#255849] bg-[#E5D8C7] text-[#1F5C4A] hover:bg-[#E6ECEA]'
                        }`}
                      >
                        {otpCooldown > 0 ? `Resend OTP in ${otpCooldown}s` : forgotOtpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>

                      {forgotOtpSent ? (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                              OTP
                            </label>
                            <input
                              name="otp"
                              type="text"
                              value={formData.otp}
                              onChange={handleTextChange}
                              placeholder="Enter OTP"
                              className={inputClass('otp')}
                            />
                            {renderError('otp')}
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={handleTextChange}
                                placeholder="Set new password"
                                className={`${inputClass('newPassword')} pr-20`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#255849]"
                              >
                                {showPassword ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            {renderError('newPassword')}
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                name="resetConfirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.resetConfirmPassword}
                                onChange={handleTextChange}
                                placeholder="Confirm new password"
                                className={`${inputClass('resetConfirmPassword')} pr-20`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#255849]"
                              >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            {renderError('resetConfirmPassword')}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-[#255849]">
                          Enter your registered email or mobile number to receive a reset OTP.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                        OTP
                      </label>
                      <div className="flex gap-3">
                        <input
                          name="otp"
                          type="text"
                          value={formData.otp}
                          onChange={handleTextChange}
                          placeholder="Enter OTP"
                          className={inputClass('otp')}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpCooldown > 0}
                          className={`rounded-xl border px-4 text-sm font-semibold transition ${
                            otpCooldown > 0
                              ? 'cursor-not-allowed border-[#E5D8C7] bg-[#E6ECEA] text-[#255849]/45 blur-[0.2px]'
                              : 'border-[#E5D8C7] bg-[#EFEAE1] text-[#1F5C4A] hover:bg-[#E6ECEA]'
                          }`}
                        >
                          {otpCooldown > 0 ? `${otpCooldown}s` : 'Send OTP'}
                        </button>
                      </div>
                      {renderError('otp')}
                    </div>
                  )
                ) : !(mode === 'register' && registerStep === 2) ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleTextChange}
                        placeholder="Password"
                        className={`${inputClass('password')} pr-20`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#255849]"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {renderError('password')}
                  </div>
                ) : null}

                {mode === 'login' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('forgot');
                        setForgotOtpSent(false);
                        setOtpCooldown(0);
                        setErrors({});
                        setStatus({ type: '', message: '' });
                      }}
                      className="font-semibold text-[#255849] transition hover:text-[#1F5C4A]"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod((prev) => (prev === 'otp' || prev === 'forgot' ? 'password' : 'otp'));
                        setForgotOtpSent(false);
                        setOtpCooldown(0);
                        setErrors({});
                        setStatus({ type: '', message: '' });
                      }}
                      className="font-semibold text-[#1F5C4A] transition hover:text-[#255849]"
                    >
                      {loginMethod === 'otp' || loginMethod === 'forgot' ? 'Use password instead' : 'Login with OTP'}
                    </button>
                  </div>
                ) : null}

                <AnimatePresence mode="wait">
                  {mode === 'register' ? (
                    <motion.div
                      key={`register-fields-step-${registerStep}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="space-y-4"
                    >
                      {registerStep === 1 ? (
                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={handleTextChange}
                              placeholder="Confirm password"
                              className={`${inputClass('confirmPassword')} pr-20`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#255849]"
                            >
                              {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          {renderError('confirmPassword')}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {role.registerFields.map((field) => (
                            <div key={field.name}>
                              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-[#255849]">
                                {field.label}
                              </label>

                              {field.type === 'file' ? (
                                <label
                                  className={`block rounded-xl border border-dashed px-4 py-3 text-sm ${
                                    errors[field.name]
                                      ? 'border-[#1F5C4A] bg-[#EFEAE1] text-[#1F5C4A]'
                                      : 'border-[#E5D8C7] bg-[#FFFFFF]/80 text-[#255849]'
                                  }`}
                                >
                                  <input
                                    name={field.name}
                                    type="file"
                                    accept={field.accept}
                                    onChange={handleFileChange}
                                    className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:px-3 file:py-2 file:text-xs file:font-semibold"
                                  />
                                  <span className="mt-2 block text-xs text-[#E5D8C7]">
                                    {formData.nationalId ? formData.nationalId.name : 'PDF, JPG, or PNG up to your browser limits.'}
                                  </span>
                                </label>
                              ) : (
                                <div className={locationFieldNames.has(field.name) ? 'flex gap-3' : ''}>
                                  <input
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={handleTextChange}
                                    placeholder={field.placeholder}
                                    className={inputClass(field.name)}
                                  />
                                  {locationFieldNames.has(field.name) ? (
                                    <button
                                      type="button"
                                      onClick={() => openGoogleMaps(formData[field.name])}
                                      className="shrink-0 rounded-xl border border-[#255849] bg-[#E5D8C7] px-4 text-xs font-bold text-[#1F5C4A] transition hover:bg-[#E6ECEA]"
                                    >
                                      Google Maps
                                    </button>
                                  ) : null}
                                </div>
                              )}

                              {renderError(field.name)}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-[#255849]">
                        Already have an account?{' '}
                        <button type="button" onClick={() => handleModeChange('login')} className="font-semibold" style={{ color: role.accentSoft }}>
                          Sign In
                        </button>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login-switch"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                    >
                      <p className="text-sm text-[#255849]">
                        New to Nasuo Hive?{' '}
                        <button type="button" onClick={() => handleModeChange('register')} className="font-bold text-[#255849]">
                          Create an account
                        </button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === 'register' && registerStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleRegisterNext}
                    className="w-full rounded-xl bg-[#1F5C4A] py-3.5 text-sm font-semibold text-[#FFFFFF] shadow-[0_8px_25px_rgba(31,92,74,0.32)] transition hover:-translate-y-0.5"
                  >
                    Next: Add {role.title} Details
                  </button>
                ) : mode === 'register' && registerStep === 2 ? (
                  <div className="grid gap-3 sm:grid-cols-[0.42fr_0.58fr]">
                    <button
                      type="button"
                      onClick={() => {
                        setRegisterStep(1);
                        setErrors({});
                        setStatus({ type: '', message: '' });
                      }}
                      className="rounded-xl border border-[#255849] bg-[#FFFFFF] py-3.5 text-sm font-semibold text-[#1F5C4A] transition hover:bg-[#E6ECEA]"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ y: -3, z: 10 }}
                      whileTap={{ y: 1 }}
                      type="submit"
                      className="rounded-xl py-3.5 text-sm font-semibold text-[#FFFFFF]"
                      style={{ background: role.accent, boxShadow: `0 8px 25px ${role.accent}55` }}
                    >
                      Create Account
                    </motion.button>
                  </div>
                ) : !(mode === 'login' && loginMethod === 'forgot' && !forgotOtpSent) ? (
                  <motion.button
                    whileHover={{ y: -3, z: 10 }}
                    whileTap={{ y: 1 }}
                    type="submit"
                    className="w-full rounded-xl py-3.5 text-sm font-semibold text-[#FFFFFF]"
                    style={{ background: role.accent, boxShadow: `0 8px 25px ${role.accent}55` }}
                  >
                    {mode === 'login' && loginMethod === 'otp'
                      ? 'Continue with OTP'
                      : mode === 'login' && loginMethod === 'forgot'
                      ? 'Set New Password'
                      : mode === 'login'
                      ? 'Sign In'
                      : 'Create Account'}
                  </motion.button>
                ) : null}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5D8C7]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-[0.16em] text-[#255849]">
                    <span className="bg-[#FFFFFF]/90 px-3">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleContinue}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E5D8C7] bg-[#FFFFFF]/80 px-4 py-3 text-sm font-semibold text-[#1F5C4A] transition hover:bg-[#E6ECEA]"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1F5C4A] text-[10px] font-bold text-[#FFFFFF]">G</span>
                  <span>Continue with Google</span>
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-[#255849]">Demo only - no data is collected</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
