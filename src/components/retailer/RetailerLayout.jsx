import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { retailerNavItems } from '../../data/retailerPortalData';
import { cn, RetailerIcon } from './RetailerUI';

const titleMap = {
  dashboard: 'Retailer Dashboard',
  products: 'Products',
  inventory: 'Inventory',
  suppliers: 'Suppliers',
  'price-comparison': 'Price Comparison',
  orders: 'Orders',
  billing: 'Billing (POS)',
  customers: 'Customers',
  payments: 'Payments',
  offers: 'Offers & Discounts',
  reports: 'Reports & Analytics',
  settings: 'Settings',
};

function RetailerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const sectionKey = useMemo(() => location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard', [location.pathname]);
  const pageTitle = titleMap[sectionKey] ?? 'Retailer Portal';

  const linkClass = ({ isActive }) =>
    cn(
      'flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-bold tracking-[0.01em] transition',
      isActive
        ? 'text-[#1F5C4A] shadow-[inset_4px_0_0_#1F5C4A]'
        : 'text-[#255849] hover:text-[#1F5C4A] hover:shadow-[inset_4px_0_0_#255849]',
    );

  return (
    <div className="min-h-screen bg-[#EFE7DA]">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.18),transparent_22%),radial-gradient(circle_at_top_right,rgba(229,216,199,0.55),transparent_18%),linear-gradient(180deg,#EFEAE1_0%,#EFE7DA_100%)]">
        <div className="flex min-h-screen">
          <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-[#E5D8C7] bg-[#EFEAE1] px-4 py-5 lg:flex lg:flex-col', sidebarCollapsed ? 'w-[92px]' : 'w-[280px]')}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#255849] bg-[#1F5C4A] text-white shadow-[0_14px_34px_rgba(31,92,74,0.3)]">N</div>
                {!sidebarCollapsed ? <div><p className="font-bold text-[#1F5C4A]">Nasuo Hive</p><p className="text-xs font-semibold text-[#255849]">Retailer Portal</p></div> : null}
              </div>
              <button onClick={() => setSidebarCollapsed((prev) => !prev)} className="rounded-xl border border-[#255849] bg-[#1F5C4A] p-2 text-white">
                <RetailerIcon name="chevron" className={cn('h-4 w-4 transition', sidebarCollapsed ? 'rotate-180' : '')} />
              </button>
            </div>

            <div className="space-y-1.5">
              {retailerNavItems.map((item) => (
                <NavLink key={item.key} to={item.key === 'dashboard' ? '/app/retailer/dashboard' : `/app/retailer/${item.key}`} className={linkClass}>
                  <RetailerIcon name={item.icon} className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : null}
                </NavLink>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-[#E5D8C7] bg-[#FFFFFF]/78 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1F5C4A] text-white lg:hidden">N</div>
                  <div className="flex items-center gap-3 rounded-[20px] border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3">
                    <RetailerIcon name="search" className="h-4 w-4 text-[#255849]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, suppliers, customers, or invoices" className="w-[220px] bg-transparent text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]/60 md:w-[360px]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end xl:self-auto">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-3 py-2.5 text-sm text-[#1F5C4A]">
                    <option>EN</option>
                    <option>HI</option>
                    <option>TE</option>
                  </select>
                  <button className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-3 text-[#1F5C4A]"><RetailerIcon name="bell" className="h-5 w-5" /></button>
                  <button className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-3 text-[#1F5C4A]"><RetailerIcon name="cart" className="h-5 w-5" /></button>
                  <div className="relative">
                    <button onClick={() => setShowProfileMenu((prev) => !prev)} className="flex items-center gap-3 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-3 py-2 text-[#1F5C4A]">
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#E5D8C7] text-[#1F5C4A]">AR</div>
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold">A. Rami</p>
                        <p className="text-xs text-[#255849]">Retail Ops Lead</p>
                      </div>
                    </button>
                    <AnimatePresence>
                      {showProfileMenu ? (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full z-20 mt-2 w-48 rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-2 shadow-xl">
                          {['Profile', 'Workspace', 'Sign out'].map((item) => <button key={item} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#1F5C4A] hover:bg-[#EFEAE1]">{item}</button>)}
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
                  <p className="text-xs uppercase tracking-[0.28em] text-[#255849]">Retailer Commerce Hub</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1F5C4A] sm:text-4xl">{pageTitle}</h1>
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

export default RetailerLayout;
