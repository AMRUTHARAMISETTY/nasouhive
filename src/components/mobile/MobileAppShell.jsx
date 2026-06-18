import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function MobileGlyph({ name, className = 'h-5 w-5' }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.9', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    grid: <><path d="M4 4h7v7H4z" /><path d="M13 4h7v7h-7z" /><path d="M4 13h7v7H4z" /><path d="M13 13h7v7h-7z" /></>,
    list: <><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
    box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" /></>,
    factory: <><path d="M4 20V9l5 3V9l5 3V5h6v15H4Z" /><path d="M8 16h2M13 16h2M17 9h1M17 13h1" /></>,
    orders: <><path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2Z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    chart: <><path d="M4 19h16" /><path d="M7 16V9M12 16V5M17 16v-7" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z" /><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M15 17H5l1.2-1.2A2 2 0 0 0 7 14.4V10a5 5 0 1 1 10 0v4.4a2 2 0 0 0 .6 1.4L19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    more: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
    mic: <><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" /><path d="M19 11a7 7 0 0 1-14 0" /><path d="M12 18v3" /><path d="M8 21h8" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    leaf: <><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Z" /><path d="M5 19c2.5-5 6-8.5 11-11" /></>,
    cart: <><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /><path d="M3 4h2l2.1 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  };
  return <svg {...common}>{icons[name] || icons.grid}</svg>;
}

export function MobileCard({ children, className = '', as: Component = 'div' }) {
  return (
    <Component className={cn('rounded-[24px] border border-white/65 bg-white/82 p-4 text-[#1F5C4A] shadow-[0_18px_44px_rgba(37,88,73,0.10)] backdrop-blur-xl', className)}>
      {children}
    </Component>
  );
}

export function StatCard({ label, value, detail, icon = 'chart', tone = 'bg-[#E6ECEA]' }) {
  return (
    <MobileCard className="min-w-[148px] flex-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#255849]/75">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#1F5C4A]">{value}</p>
        </div>
        <span className={cn('grid h-10 w-10 place-items-center rounded-2xl text-[#1F5C4A]', tone)}>
          <MobileGlyph name={icon} className="h-5 w-5" />
        </span>
      </div>
      {detail ? <p className="mt-3 text-xs font-medium leading-5 text-[#255849]">{detail}</p> : null}
    </MobileCard>
  );
}

export function ActionCard({ title, description, icon = 'plus', onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={onClick} className="w-full text-left">
      <MobileCard className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[20px] bg-[#E6ECEA] text-[#1F5C4A]">
          <MobileGlyph name={icon} className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-[#1F5C4A]">{title}</span>
          {description ? <span className="mt-1 block text-sm leading-5 text-[#255849]">{description}</span> : null}
          {children}
        </span>
      </MobileCard>
    </motion.button>
  );
}

export function OrderCard({ title, subtitle, total, status, meta, children }) {
  return (
    <MobileCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-[#1F5C4A]">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-[#255849]">{subtitle}</p> : null}
        </div>
        {status ? <span className="rounded-full bg-[#E6ECEA] px-3 py-1 text-xs font-bold text-[#1F5C4A]">{status}</span> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#255849]">
        {total ? <span>{total}</span> : <span />}
        {meta ? <span>{meta}</span> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </MobileCard>
  );
}

export function InventoryCard({ item, statusSlot, image }) {
  return (
    <MobileCard className="overflow-hidden p-0">
      {image ? <img src={image} alt={item.name} className="aspect-[4/3] w-full object-cover" loading="lazy" /> : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[#1F5C4A]">{item.name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#255849]/75">{item.sku}</p>
          </div>
          {statusSlot}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(item.details || {}).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#EFEAE1] p-3">
              <p className="text-xs font-semibold text-[#255849]/75">{label}</p>
              <p className="mt-1 break-words font-bold text-[#1F5C4A]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </MobileCard>
  );
}

export function MobileChartCard({ title, description, children }) {
  return (
    <MobileCard>
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-[-0.02em] text-[#1F5C4A]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-5 text-[#255849]">{description}</p> : null}
      </div>
      <div className="h-[230px] min-w-0 overflow-hidden">{children}</div>
    </MobileCard>
  );
}

export function BottomSheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-end bg-black/25 px-3 pb-3 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: 420 }}
            animate={{ y: 0 }}
            exit={{ y: 420 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="max-h-[86vh] w-full overflow-y-auto rounded-[28px] border border-white/70 bg-[#EFEAE1]/95 p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[0_-18px_48px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:mx-auto md:max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#255849]/25" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#1F5C4A]">{title}</h2>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-[#1F5C4A]">x</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function BottomNav({ items, moreItems, moreOpen, setMoreOpen }) {
  return (
    <nav className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/82 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_34px_rgba(37,88,73,0.14)] backdrop-blur-2xl">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => (
          <NavLink key={item.key} to={item.to} className={({ isActive }) => cn('flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-bold transition', isActive ? 'bg-[#1F5C4A] text-white' : 'text-[#255849]')}>
            <MobileGlyph name={item.icon} className="h-5 w-5" />
            <span className="max-w-full truncate">{item.shortLabel || item.label}</span>
          </NavLink>
        ))}
        <button type="button" onClick={() => setMoreOpen(true)} className={cn('flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-bold transition', moreOpen ? 'bg-[#1F5C4A] text-white' : 'text-[#255849]')}>
          <MobileGlyph name="more" className="h-5 w-5" />
          <span>More</span>
        </button>
      </div>
      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More sections">
        <div className="grid gap-3">
          {moreItems.map((item) => (
            <NavLink key={item.key} to={item.to} onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/82 px-4 py-4 text-sm font-bold text-[#1F5C4A]">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#E6ECEA]"><MobileGlyph name={item.icon} className="h-5 w-5" /></span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </BottomSheet>
    </nav>
  );
}

export function MobileHeader({ title, eyebrow, search, setSearch, onProfile, profileLabel = 'AR', className = '' }) {
  return (
    <header className={cn('sticky top-0 z-30 border-b border-white/60 bg-[#EFEAE1]/86 px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] backdrop-blur-2xl', className)}>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#255849]/70">{eyebrow}</p> : null}
            <h1 className="truncate text-xl font-black tracking-[-0.03em] text-[#1F5C4A]">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/82 text-[#1F5C4A] shadow-sm">
              <MobileGlyph name="bell" className="h-5 w-5" />
            </button>
            <button onClick={onProfile} className="grid h-11 w-11 place-items-center rounded-full bg-[#1F5C4A] text-sm font-black text-white shadow-[0_12px_28px_rgba(31,92,74,0.28)]">
              {profileLabel}
            </button>
          </div>
        </div>
        {setSearch ? (
          <div className="mt-3 flex min-h-12 items-center gap-3 rounded-[18px] border border-white/70 bg-white/82 px-4 shadow-[0_10px_24px_rgba(37,88,73,0.08)]">
            <MobileGlyph name="search" className="h-5 w-5 text-[#255849]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Nasou Hive" className="w-full bg-transparent text-sm font-semibold text-[#1F5C4A] outline-none placeholder:text-[#255849]/55" />
          </div>
        ) : null}
      </div>
    </header>
  );
}

function ResponsiveSidebar({ title, eyebrow, items, open, onClose }) {
  return (
    <aside className={cn('responsive-sidebar', !open && 'is-closed')}>
      <button type="button" onClick={onClose} className="responsive-sidebar-close" aria-label="Close sidebar" title="Close sidebar">
        <MobileGlyph name="close" className="h-4 w-4" />
      </button>
      <NavLink to="/app/auth" className="responsive-brand" aria-label="Nasou Hive home">
        <span className="responsive-brand-mark">N</span>
        <span className="responsive-brand-copy">
          <span>Nasou Hive</span>
          <small>{eyebrow}</small>
        </span>
      </NavLink>

      <nav className="responsive-sidebar-nav" aria-label={`${title} sections`}>
        {items.map((item) => (
          <NavLink key={item.key} to={item.to} className={({ isActive }) => cn('responsive-sidebar-link', isActive && 'is-active')}>
            <MobileGlyph name={item.icon} className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function ResponsiveHeader({ title, eyebrow, search, setSearch, onProfile, onToggleSidebar, sidebarOpen, profileLabel = 'AR' }) {
  const openAssistant = () => window.dispatchEvent(new CustomEvent('nasuo:open-assistant'));
  const searchPlaceholder = eyebrow?.includes('Retailer') ? 'Search products, suppliers, orders...' : 'Search Nasou Hive';

  return (
    <header className="responsive-header">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onToggleSidebar} className="responsive-icon-button" aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'} title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          <MobileGlyph name={sidebarOpen ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
        <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#255849]/70">{eyebrow}</p> : null}
        <h1 className="truncate text-2xl font-black tracking-[-0.03em] text-[#1F5C4A]">{title}</h1>
        </div>
      </div>
      <div className="responsive-header-actions">
        {setSearch ? (
          <label className="responsive-search">
            <MobileGlyph name="search" className="h-5 w-5 text-[#255849]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} />
          </label>
        ) : null}
        <select className="responsive-language" aria-label="Language">
          <option>EN</option>
          <option>HI</option>
          <option>TE</option>
        </select>
        <button type="button" onClick={openAssistant} className="responsive-icon-button" aria-label="Open AI assistant" title="AI Assistant">
          <MobileGlyph name="spark" className="h-5 w-5" />
        </button>
        <button type="button" className="responsive-icon-button" aria-label="Notifications">
          <MobileGlyph name="bell" className="h-5 w-5" />
        </button>
        <button type="button" onClick={onProfile} className="responsive-avatar" aria-label="Open profile">
          {profileLabel}
        </button>
      </div>
    </header>
  );
}

export function MobileAppShell({ title, eyebrow, navItems, children, search, setSearch, onSignOut }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const promoted = useMemo(() => navItems.slice(0, 4), [navItems]);
  const moreItems = useMemo(() => navItems.slice(4), [navItems]);

  const signOut = () => {
    if (onSignOut) onSignOut();
    navigate('/app/auth', { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EFEAE1] text-[#1F5C4A]">
      <div className={cn('responsive-app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(229,216,199,0.8),transparent_24%),linear-gradient(180deg,#EFEAE1_0%,#F5F1EA_48%,#EFEAE1_100%)]', !sidebarOpen && 'sidebar-closed')}>
        <ResponsiveSidebar title={title} eyebrow={eyebrow} items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="responsive-content">
          <MobileHeader className="mobile-shell-header" title={title} eyebrow={eyebrow} search={search} setSearch={setSearch} onProfile={() => setProfileOpen(true)} />
          <ResponsiveHeader title={title} eyebrow={eyebrow} search={search} setSearch={setSearch} onProfile={() => setProfileOpen(true)} onToggleSidebar={() => setSidebarOpen((value) => !value)} sidebarOpen={sidebarOpen} />
          <main className="responsive-main mx-auto max-w-5xl px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-5">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="space-y-5">
            {children}
          </motion.div>
          </main>
        </div>
        <BottomNav items={promoted} moreItems={moreItems} moreOpen={moreOpen} setMoreOpen={setMoreOpen} />
        <BottomSheet open={profileOpen} onClose={() => setProfileOpen(false)} title="Profile">
          <div className="space-y-3">
            <MobileCard>
              <p className="text-sm font-semibold text-[#255849]">Account</p>
              <p className="mt-2 text-2xl font-black text-[#1F5C4A]">A. Rami</p>
              <p className="mt-1 text-sm text-[#255849]">{eyebrow}</p>
            </MobileCard>
            <button type="button" onClick={signOut} className="min-h-12 w-full rounded-2xl bg-[#1F5C4A] px-5 py-3 text-sm font-bold text-white">Logout</button>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
