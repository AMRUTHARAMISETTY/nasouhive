import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { manufacturerNavItems } from '../../data/manufacturerDashboardData';
import { cn, Icon } from './ManufacturerUI';

const titleMap = {
  dashboard: 'Manufacturer Dashboard',
  'raw-materials': 'Raw Materials',
  planning: 'Production Planning',
  manufacturing: 'Manufacturing',
  inventory: 'Inventory',
  quality: 'Quality Control',
  machines: 'Machines',
  'supply-chain': 'Supply Chain',
  orders: 'Orders',
  warehouses: 'Warehouses',
  reports: 'Reports & Analytics',
  settings: 'Settings',
};

function ManufacturerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const sectionKey = useMemo(() => location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard', [location.pathname]);
  const pageTitle = titleMap[sectionKey] ?? 'Manufacturer Portal';

  const linkClass = ({ isActive }) =>
    cn(
      'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition',
      isActive ? 'bg-[#1f5c4a] text-white shadow-[0_16px_34px_rgba(31,92,74,0.22)]' : 'text-[#526860] hover:bg-[#f3ece3]',
    );

  return (
    <div className="min-h-screen bg-[#f4ede3]">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(215,199,173,0.42),transparent_18%),linear-gradient(180deg,#f6f0e6_0%,#efe7da_100%)]">
        <div className="flex min-h-screen">
          <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-[#e2d8ca] bg-white/72 px-4 py-5 lg:flex lg:flex-col', sidebarCollapsed ? 'w-[92px]' : 'w-[280px]')}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1f5c4a] text-white shadow-[0_14px_34px_rgba(31,92,74,0.35)]">N</div>
                {!sidebarCollapsed ? <div><p className="font-semibold text-[#17342a]">Nasuo Hive</p><p className="text-xs text-[#778981]">Manufacturer Portal</p></div> : null}
              </div>
              <button onClick={() => setSidebarCollapsed((prev) => !prev)} className="rounded-xl bg-[#f3ede5] p-2 text-[#1f5c4a]">
                <Icon name="chevron" className={cn('h-4 w-4 transition', sidebarCollapsed ? 'rotate-180' : '')} />
              </button>
            </div>

            <div className="space-y-1.5">
              {manufacturerNavItems.map((item) => (
                <NavLink key={item.key} to={item.key === 'dashboard' ? '/app/manufacturer/dashboard' : `/app/manufacturer/${item.key}`} className={linkClass}>
                  <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : null}
                </NavLink>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-[#e2d8ca] bg-[#f6f0e7]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f5c4a] text-white lg:hidden">N</div>
                  <div className="flex items-center gap-3 rounded-[20px] border border-[#e2d8ca] bg-white/80 px-4 py-3">
                    <Icon name="search" className="h-4 w-4 text-[#778981]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search production batches, SKUs, or suppliers" className="w-[220px] bg-transparent text-sm text-[#17342a] outline-none placeholder:text-[#8a9991] md:w-[360px]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end xl:self-auto">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-[#e2d8ca] bg-white px-3 py-2.5 text-sm text-[#17342a]">
                    <option>EN</option>
                    <option>HI</option>
                    <option>TE</option>
                  </select>
                  <button className="rounded-2xl border border-[#e2d8ca] bg-white p-3 text-[#17342a]"><Icon name="bell" className="h-5 w-5" /></button>
                  <div className="relative">
                    <button onClick={() => setShowProfileMenu((prev) => !prev)} className="flex items-center gap-3 rounded-2xl border border-[#e2d8ca] bg-white px-3 py-2 text-[#17342a]">
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#d7c7ad] text-[#17342a]">AR</div>
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold">A. Rami</p>
                        <p className="text-xs text-[#778981]">Plant Admin</p>
                      </div>
                    </button>
                    <AnimatePresence>
                      {showProfileMenu ? (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full z-20 mt-2 w-48 rounded-[18px] border border-[#e2d8ca] bg-white p-2 shadow-xl">
                          {['Profile', 'Workspace', 'Sign out'].map((item) => <button key={item} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#35584b] hover:bg-[#f4eee7]">{item}</button>)}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-[1600px] space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#778981]">Manufacturer Portal</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#17342a] sm:text-4xl">{pageTitle}</h1>
                </div>
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManufacturerLayout;
