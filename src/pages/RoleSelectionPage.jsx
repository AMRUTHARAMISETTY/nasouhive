import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const roles = [
  {
    key: 'manufacturer',
    title: 'Manufacturer',
    accent: '#1F5C4A',
    glow: 'rgba(31,92,74,0.28)',
    copy: 'Direct production flow, dispatch cadence, and batch-level visibility from one command surface.',
    eyebrow: 'Production control',
    imageLabel: 'Illustration of a manufacturer workspace',
  },
  {
    key: 'retailer',
    title: 'Retailer',
    accent: '#255849',
    glow: 'rgba(37,88,73,0.24)',
    copy: 'Balance stock, move faster on replenishment, and watch order health before shelves fall behind.',
    eyebrow: 'Shelf velocity',
    imageLabel: 'Illustration of a retail planning workspace',
  },
  {
    key: 'customer',
    title: 'Customer',
    accent: '#406F60',
    glow: 'rgba(64,111,96,0.24)',
    copy: 'Follow provenance, confirm sustainability signals, and manage purchases in a cleaner experience.',
    eyebrow: 'Traceable buying',
    imageLabel: 'Illustration of a customer shopping workspace',
  },
];

const illustrationVariants = {
  manufacturer: (
    <svg viewBox="0 0 360 240" className="h-full w-full" role="img" aria-label="Illustration of a manufacturer workspace">
      <defs>
        <linearGradient id="mBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A715D" />
          <stop offset="100%" stopColor="#123E31" />
        </linearGradient>
      </defs>
      <rect x="18" y="20" width="324" height="200" rx="34" fill="url(#mBg)" />
      <ellipse cx="180" cy="202" rx="108" ry="18" fill="rgba(8,22,17,0.24)" />
      <rect x="42" y="58" width="86" height="76" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" />
      <rect x="60" y="76" width="50" height="12" rx="6" fill="#E8DED0" />
      <rect x="60" y="96" width="34" height="10" rx="5" fill="rgba(232,222,208,0.72)" />
      <rect x="152" y="48" width="150" height="110" rx="26" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
      <rect x="172" y="70" width="110" height="14" rx="7" fill="#F6EFE4" />
      <rect x="172" y="94" width="58" height="10" rx="5" fill="rgba(246,239,228,0.68)" />
      <rect x="172" y="120" width="42" height="22" rx="11" fill="#E7D8C3" />
      <rect x="224" y="120" width="58" height="22" rx="11" fill="rgba(231,216,195,0.42)" />
      <rect x="78" y="138" width="44" height="48" rx="16" fill="#E9C99A" />
      <rect x="126" y="122" width="30" height="64" rx="14" fill="#F6EFE4" />
      <rect x="160" y="110" width="54" height="76" rx="18" fill="rgba(255,255,255,0.16)" />
      <circle cx="278" cy="52" r="18" fill="rgba(255,255,255,0.16)" />
      <path d="M268 52h20M278 42v20" stroke="#F6EFE4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  retailer: (
    <svg viewBox="0 0 360 240" className="h-full w-full" role="img" aria-label="Illustration of a retail planning workspace">
      <defs>
        <linearGradient id="rBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#336C5C" />
          <stop offset="100%" stopColor="#173C31" />
        </linearGradient>
      </defs>
      <rect x="18" y="20" width="324" height="200" rx="34" fill="url(#rBg)" />
      <ellipse cx="178" cy="204" rx="112" ry="16" fill="rgba(8,22,17,0.24)" />
      <rect x="42" y="48" width="276" height="132" rx="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
      <rect x="64" y="70" width="92" height="88" rx="18" fill="rgba(255,255,255,0.08)" />
      <rect x="176" y="70" width="118" height="18" rx="9" fill="#F6EFE4" />
      <rect x="176" y="100" width="90" height="10" rx="5" fill="rgba(246,239,228,0.72)" />
      <rect x="176" y="118" width="76" height="10" rx="5" fill="rgba(246,239,228,0.44)" />
      <path d="M80 144c18-30 38-52 60-52 16 0 28 12 28 28 0 20-14 34-34 34-8 0-16-2-26-10" stroke="#E8DED0" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="104" cy="104" r="12" fill="#E9C99A" />
      <circle cx="176" cy="170" r="20" fill="#E7D8C3" />
      <path d="M176 170l18-14 22 10" stroke="#1B4D3E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="216" y="148" width="78" height="22" rx="11" fill="rgba(255,255,255,0.14)" />
    </svg>
  ),
  customer: (
    <svg viewBox="0 0 360 240" className="h-full w-full" role="img" aria-label="Illustration of a customer shopping workspace">
      <defs>
        <linearGradient id="cBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D7C6E" />
          <stop offset="100%" stopColor="#184638" />
        </linearGradient>
      </defs>
      <rect x="18" y="20" width="324" height="200" rx="34" fill="url(#cBg)" />
      <ellipse cx="180" cy="204" rx="110" ry="16" fill="rgba(8,22,17,0.24)" />
      <rect x="46" y="52" width="126" height="132" rx="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" />
      <circle cx="109" cy="88" r="24" fill="#F6EFE4" />
      <path d="M92 116c10-10 24-16 40-16 18 0 34 8 44 22" stroke="#E7D8C3" strokeWidth="8" strokeLinecap="round" />
      <rect x="190" y="58" width="120" height="96" rx="24" fill="rgba(255,255,255,0.12)" />
      <path d="M214 84h72M214 106h54" stroke="#F6EFE4" strokeWidth="10" strokeLinecap="round" />
      <rect x="208" y="124" width="44" height="18" rx="9" fill="#E9C99A" />
      <rect x="88" y="152" width="182" height="24" rx="12" fill="rgba(255,255,255,0.14)" />
      <circle cx="280" cy="158" r="18" fill="#E7D8C3" />
      <path d="M280 148v20M270 158h20" stroke="#255849" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
};

const cardMotion = {
  rest: { rotateX: 0, rotateY: 0, y: 0, scale: 1 },
  hover: { rotateX: 12, rotateY: -12, y: -14, scale: 1.015 },
};

function RoleArtwork({ role }) {
  return (
    <div
      className="relative h-[180px] overflow-hidden rounded-[28px] border border-white/30"
      style={{
        transform: 'translateZ(58px)',
        background: `radial-gradient(circle at 22% 18%, rgba(255,255,255,0.24), transparent 22%), linear-gradient(145deg, ${role.accent}, #123e31)`,
        boxShadow: `0 30px 50px ${role.glow}`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(255,255,255,0.18),transparent_16%),linear-gradient(180deg,transparent_0%,rgba(8,22,17,0.16)_100%)]" />
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-md" />
      <div className="absolute -left-4 bottom-4 h-14 w-14 rounded-[22px] border border-white/15 bg-white/10 backdrop-blur-md" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/20 bg-white/10 shadow-[0_20px_35px_rgba(8,22,17,0.18)] backdrop-blur-md" style={{ transform: 'translate(-50%, -50%) rotate(18deg)' }} />
      <div className="absolute left-1/2 top-1/2 h-16 w-36 -translate-x-1/2 rounded-full border border-white/15 bg-white/8 blur-sm" style={{ transform: 'translateX(-50%) translateY(38px)' }} />
      <div className="absolute inset-0">{illustrationVariants[role.key]}</div>
    </div>
  );
}

const RoleSelectionPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(31,92,74,0.22),transparent_18%),radial-gradient(circle_at_83%_14%,rgba(229,216,199,0.96),transparent_17%),radial-gradient(circle_at_50%_82%,rgba(64,111,96,0.18),transparent_24%),linear-gradient(180deg,#f8f1e6_0%,#efe7da_48%,#e6dbc9_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,88,73,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,88,73,0.045)_1px,transparent_1px)] bg-[size:110px_110px] opacity-45 [mask-image:radial-gradient(circle_at_center,black_38%,transparent_85%)]" />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[4%] top-[10%] h-44 w-44 rounded-[34px] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(255,255,255,0.08))] shadow-[0_30px_80px_rgba(31,92,74,0.14)] backdrop-blur-md"
        style={{ transform: 'rotate(-14deg)' }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 22, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[3%] top-[14%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(31,92,74,0.24)_0%,rgba(31,92,74,0.08)_42%,transparent_70%)] blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-[8%] right-[11%] h-32 w-32 rounded-[28px] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.24),rgba(255,255,255,0.08))] shadow-[0_28px_60px_rgba(37,88,73,0.12)] backdrop-blur-md"
        style={{ transform: 'rotate(18deg)' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-6 max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.34em] text-[#255849]/75">Nasou Hive Access</p>
          <h1 className="mt-2 font-display text-3xl leading-[0.95] tracking-[-0.04em] text-[#25483c] sm:text-4xl">
            Choose the role layer that matches how you move through the network.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4f635b]">
            Each route opens a tailored sign in and onboarding flow. The page keeps the same palette, but the cards now behave more like product objects than flat panels.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: index * 0.08 }}
              className="group [perspective:1800px]"
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardMotion}
                transition={{ type: 'spring', stiffness: 190, damping: 15 }}
                className="relative h-full min-h-[420px] rounded-[30px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(247,241,232,0.74))] shadow-[0_28px_56px_rgba(25,67,54,0.16)]" />
                <div
                  className="absolute inset-0 rounded-[30px] border border-white/65"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.62), 0 0 0 1px ${role.accent}16` }}
                />
                <div
                  className="absolute inset-x-7 bottom-3 h-10 rounded-full blur-2xl"
                  style={{ background: role.glow, transform: 'translateZ(8px)' }}
                />

                <div className="relative flex h-full flex-col p-5 sm:p-6" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="flex items-center justify-between" style={{ transform: 'translateZ(36px)' }}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/68 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#35584b]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: role.accent }} />
                      {role.eyebrow}
                    </div>
                    <div
                      className="h-9 w-9 rounded-2xl border border-white/50 bg-white/28 backdrop-blur-md"
                      style={{ boxShadow: `0 12px 24px ${role.glow}`, transform: 'translateZ(50px)' }}
                    />
                  </div>

                  <div className="mt-4">
                    <RoleArtwork role={role} />
                  </div>

                  <div className="mt-5" style={{ transform: 'translateZ(72px)' }}>
                    <h2 className="text-2xl font-semibold text-[#173c31]">{role.title} Portal</h2>
                    <p className="mt-2 text-sm leading-6 text-[#5a6d65]">{role.copy}</p>
                  </div>

                  <div className="mt-auto pt-6" style={{ transform: 'translateZ(88px)' }}>
                    <Link
                      to={`/app/auth/${role.key}`}
                      className="inline-flex w-full items-center justify-between rounded-[20px] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_34px_rgba(18,62,49,0.22)] transition-transform duration-300 group-hover:translate-y-[-2px]"
                      style={{ background: `linear-gradient(180deg, ${role.accent}, #123e31)` }}
                    >
                      <span className="text-white">Continue as {role.title}</span>
                      <span aria-hidden="true">-&gt;</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
