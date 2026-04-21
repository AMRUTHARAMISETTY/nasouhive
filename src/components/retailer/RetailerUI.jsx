import React from 'react';
import { motion } from 'framer-motion';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function RetailerIcon({ name, className = 'h-5 w-5' }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' };
  const icons = {
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" /></>,
    archive: <><path d="M4 7h16v4H4z" /><path d="M6 11h12v8H6z" /><path d="M10 15h4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3" /><path d="M20 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 4.1a3 3 0 0 1 0 5.8" /></>,
    compare: <><path d="M8 4H4v4M16 20h4v-4" /><path d="M4 8 10 2M20 16l-6 6" /><path d="M16 4h4v4M8 20H4v-4" /><path d="M20 8 14 2M4 16l6 6" /></>,
    bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 9V7a3 3 0 1 1 6 0v2" /></>,
    receipt: <><path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2Z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>,
    gift: <><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" /><path d="M2 7h20v5H2z" /><path d="M12 7v13" /><path d="M12 7H8.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7ZM12 7h3.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z" /></>,
    chart: <><path d="M4 19h16" /><path d="M7 16V9M12 16V5M17 16v-7" /></>,
    settings: <><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M15 17H5l1.2-1.2A2 2 0 0 0 7 14.4V10a5 5 0 1 1 10 0v4.4a2 2 0 0 0 .6 1.4L19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    cart: <><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /><path d="M3 4h2l2.1 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
  };
  return <svg {...common}>{icons[name]}</svg>;
}

export function RetailerCard({ children, className = '', dark = false }) {
  return <div className={cn('rounded-[20px] border p-5 shadow-[0_18px_40px_rgba(37,88,73,0.08)] backdrop-blur-xl', dark ? 'border-[#FFFFFF]/30 bg-[#1F5C4A] text-white' : 'border-[#E5D8C7] bg-[#FFFFFF]/86 text-[#1F5C4A]', className)}>{children}</div>;
}

export function RetailerBadge({ value, dark = false }) {
  const styles = {
    Active: 'bg-emerald-500/15 text-emerald-600',
    Healthy: 'bg-emerald-500/15 text-emerald-600',
    Paid: 'bg-emerald-500/15 text-emerald-600',
    Approved: 'bg-emerald-500/15 text-emerald-600',
    Delivered: 'bg-emerald-500/15 text-emerald-600',
    Success: 'bg-emerald-500/15 text-emerald-600',
    Requested: 'bg-amber-500/15 text-amber-600',
    Due: 'bg-amber-500/15 text-amber-600',
    Draft: 'bg-slate-500/15 text-slate-600',
    Scheduled: 'bg-violet-500/15 text-violet-600',
    Low: 'bg-amber-500/15 text-amber-600',
    Inspection: 'bg-sky-500/15 text-sky-600',
    Shipped: 'bg-sky-500/15 text-sky-600',
    Processing: 'bg-sky-500/15 text-sky-600',
    'Best Deal': 'bg-emerald-500/15 text-emerald-600',
    Fastest: 'bg-amber-500/15 text-amber-600',
    'Top Rated': 'bg-violet-500/15 text-violet-600',
  };
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', dark ? 'bg-white/10' : '', styles[value] || 'bg-slate-500/15 text-slate-600')}>{value}</span>;
}

export function RetailerAction({ children, dark = false }) {
  return <button className={cn('rounded-2xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5', dark ? 'bg-[#FFFFFF]/10 text-white hover:bg-[#FFFFFF]/14' : 'bg-[#1F5C4A] text-[#FFFFFF] hover:bg-[#255849]')}>{children}</button>;
}

export function RetailerStat({ item, dark = false }) {
  const toneClass = { emerald: 'from-emerald-500/18 to-emerald-400/0', amber: 'from-amber-500/18 to-amber-400/0', blue: 'from-sky-500/18 to-sky-400/0', violet: 'from-violet-500/18 to-violet-400/0' }[item.tone];
  return (
    <RetailerCard dark={dark} className="relative overflow-hidden">
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
    </RetailerCard>
  );
}

export function RetailerSectionHeader({ title, description, action, dark = false }) {
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

export function RetailerSkeleton({ dark = false, className = '' }) {
  return <div className={cn('animate-pulse rounded-2xl', dark ? 'bg-[#FFFFFF]/8' : 'bg-[#EFE7DA]', className)} />;
}

export function ComparisonCard({ item, dark = false }) {
  return (
    <motion.div whileHover={{ y: -2 }} className={cn('rounded-[18px] border p-4', dark ? 'border-white/10 bg-white/5' : 'border-[#E5D8C7] bg-[#FFFFFF]')}>
      <div className="flex items-center justify-between gap-3"><p className="font-semibold">{item.manufacturer}</p><RetailerBadge dark={dark} value={item.badge} /></div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div><p className={cn(dark ? 'text-slate-400' : 'text-[#255849]')}>Price</p><p className="mt-1 font-semibold">{item.price}</p></div>
        <div><p className={cn(dark ? 'text-slate-400' : 'text-[#255849]')}>Delivery</p><p className="mt-1 font-semibold">{item.delivery}</p></div>
        <div><p className={cn(dark ? 'text-slate-400' : 'text-[#255849]')}>Rating</p><p className="mt-1 font-semibold">{item.rating}</p></div>
      </div>
      <button className="mt-4 rounded-full bg-[#1f5c4a] px-4 py-2.5 text-sm font-semibold text-white">Buy Now</button>
    </motion.div>
  );
}
