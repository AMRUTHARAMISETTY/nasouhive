import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Icon({ name, className = 'h-5 w-5' }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' };
  const icons = {
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    layers: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 11 8 4 8-4" /><path d="m4 15 8 4 8-4" /></>,
    calendar: <><path d="M7 3v4M17 3v4M4 9h16" /><rect x="4" y="5" width="16" height="15" rx="2" /></>,
    flow: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8.5 6h7M7.4 8l3.1 7M16.6 8l-3.1 7" /></>,
    archive: <><path d="M4 7h16v4H4z" /><path d="M6 11h12v8H6z" /><path d="M10 15h4" /></>,
    shield: <><path d="M12 3 5 6v6c0 4.2 2.6 7.4 7 9 4.4-1.6 7-4.8 7-9V6l-7-3Z" /><path d="m9.5 12 1.7 1.7 3.8-3.8" /></>,
    cpu: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" /></>,
    truck: <><path d="M3 7h11v8H3zM14 10h3l3 3v2h-6z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" /></>,
    map: <><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" /><path d="M9 4v14M15 6v14" /></>,
    chart: <><path d="M4 19h16" /><path d="M7 16V9M12 16V5M17 16v-7" /></>,
    settings: <><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M15 17H5l1.2-1.2A2 2 0 0 0 7 14.4V10a5 5 0 1 1 10 0v4.4a2 2 0 0 0 .6 1.4L19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
  };
  return <svg {...common}>{icons[name] || <circle cx="12" cy="12" r="9" />}</svg>;
}

export function ThemeCard({ children, className = '', dark = false }) {
  return (
    <div className={cn('rounded-[20px] border p-5 shadow-[0_18px_40px_rgba(37,88,73,0.08)] backdrop-blur-xl', dark ? 'border-[#FFFFFF]/30 bg-[#1F5C4A] text-white' : 'border-[#E5D8C7] bg-[#FFFFFF]/86 text-[#1F5C4A]', className)}>
      {children}
    </div>
  );
}

export function StatusBadge({ value, dark = false }) {
  const styles = {
    Approved: 'bg-emerald-500/15 text-emerald-600', Healthy: 'bg-emerald-500/15 text-emerald-600', Pass: 'bg-emerald-500/15 text-emerald-600', Active: 'bg-emerald-500/15 text-emerald-600', Completed: 'bg-emerald-500/15 text-emerald-600',
    Running: 'bg-blue-500/15 text-blue-600', Queued: 'bg-amber-500/15 text-amber-600', Ready: 'bg-violet-500/15 text-violet-600', Low: 'bg-amber-500/15 text-amber-600', Critical: 'bg-rose-500/15 text-rose-600',
    Hold: 'bg-rose-500/15 text-rose-600', Inspection: 'bg-sky-500/15 text-sky-600', Fail: 'bg-rose-500/15 text-rose-600', Maintenance: 'bg-amber-500/15 text-amber-600', Idle: 'bg-slate-500/15 text-slate-600',
    Delayed: 'bg-rose-500/15 text-rose-600', 'Pending Approval': 'bg-amber-500/15 text-amber-600', High: 'bg-rose-500/15 text-rose-600', Medium: 'bg-sky-500/15 text-sky-600',
  };
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', dark ? 'bg-white/10' : '', styles[value] || 'bg-slate-500/15 text-slate-600')}>{value}</span>;
}

export function SectionHeader({ title, description, action, dark = false }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className={cn('text-xl font-semibold tracking-[-0.03em]', dark ? 'text-white' : 'text-[#1F5C4A]')}>{title}</h2>
        {description ? <p className={cn('mt-1 text-sm', dark ? 'text-[#E6ECEA]' : 'text-[#255849]')}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ActionButton({ children, dark = false }) {
  return <button className={cn('rounded-2xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5', dark ? 'bg-[#FFFFFF]/10 text-white hover:bg-[#FFFFFF]/14' : 'bg-[#1F5C4A] text-[#FFFFFF] hover:bg-[#255849]')}>{children}</button>;
}

export function MiniStat({ item, dark = false }) {
  const toneClass = { emerald: 'from-emerald-500/18 to-emerald-400/0', amber: 'from-amber-500/18 to-amber-400/0', blue: 'from-sky-500/18 to-sky-400/0', violet: 'from-violet-500/18 to-violet-400/0' }[item.tone];
  return (
    <ThemeCard dark={dark} className="relative overflow-hidden">
      <div className={cn('absolute inset-0 bg-gradient-to-br', toneClass)} />
      <div className="relative">
        <p className={cn('text-sm', dark ? 'text-[#E6ECEA]' : 'text-[#255849]')}>{item.label}</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className={cn('text-3xl font-semibold tracking-[-0.04em]', dark ? 'text-white' : 'text-[#1F5C4A]')}>{item.value}</p>
            <p className={cn('mt-2 text-xs', dark ? 'text-[#E6ECEA]/80' : 'text-[#255849]')}>{item.detail}</p>
          </div>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', dark ? 'bg-[#FFFFFF]/10 text-white' : 'bg-[#EFEAE1] text-[#1F5C4A]')}>{item.delta}</span>
        </div>
      </div>
    </ThemeCard>
  );
}

export function TooltipChip({ label, tip, dark = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} className={cn('rounded-full px-3 py-1 text-xs font-medium', dark ? 'bg-[#FFFFFF]/10 text-[#E6ECEA]' : 'bg-[#EFEAE1] text-[#1F5C4A]')}>
        {label}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className={cn('absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2 rounded-2xl border px-3 py-2 text-xs shadow-lg', dark ? 'border-[#FFFFFF]/30 bg-[#1F5C4A] text-[#E6ECEA]' : 'border-[#E5D8C7] bg-[#FFFFFF] text-[#255849]')}>
            {tip}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SkeletonBlock({ dark = false, className = '' }) {
  return <div className={cn('animate-pulse rounded-2xl', dark ? 'bg-[#FFFFFF]/8' : 'bg-[#EFE7DA]', className)} />;
}
