import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  posPayments,
  priceComparisons,
  retailerAlerts,
  retailerCustomers,
  retailerInventory,
  retailerNavItems,
  retailerOffers,
  retailerOrders,
  retailerPayments,
  retailerProducts,
  retailerRecentActivity,
  retailerReports,
  retailerStats,
  retailerSuppliers,
} from '../data/retailerPortalData';
import { cn, ComparisonCard, RetailerAction, RetailerBadge, RetailerCard, RetailerIcon, RetailerSectionHeader, RetailerSkeleton, RetailerStat } from '../components/retailer/RetailerUI';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

function RetailerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = darkMode
    ? { bg: 'bg-[#0b1220]', shell: 'bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_18%),linear-gradient(180deg,#0b1220_0%,#111827_100%)]', border: 'border-white/10', text: 'text-white', sub: 'text-slate-300', mute: 'text-slate-400', sidebar: 'bg-[#0f1726]/94' }
    : { bg: 'bg-[#f4ede3]', shell: 'bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.14),transparent_22%),radial-gradient(circle_at_top_right,rgba(208,168,110,0.22),transparent_18%),linear-gradient(180deg,#f6f0e6_0%,#efe7da_100%)]', border: 'border-[#e2d8ca]', text: 'text-[#17342a]', sub: 'text-[#5d7168]', mute: 'text-[#778981]', sidebar: 'bg-white/72' };

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: darkMode ? '#e2e8f0' : '#475c54', boxWidth: 12, boxHeight: 12 } } },
    scales: {
      x: { ticks: { color: darkMode ? '#94a3b8' : '#71837c' }, grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(31,92,74,0.06)' } },
      y: { ticks: { color: darkMode ? '#94a3b8' : '#71837c' }, grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(31,92,74,0.06)' } },
    },
  }), [darkMode]);

  const salesTrend = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Sales', data: [8200, 9400, 10100, 11240, 13680, 14820, 16400], borderColor: '#1F5C4A', backgroundColor: 'rgba(31,92,74,0.14)', fill: true, tension: 0.35, pointRadius: 0 }],
  }), []);

  const topSelling = useMemo(() => ({
    labels: ['Kettle', 'Desk Lamp', 'Noise Buds', 'Serum'],
    datasets: [{ label: 'Units Sold', data: [420, 312, 288, 260], backgroundColor: ['#1F5C4A', '#406F60', '#D0A86E', '#759B8C'], borderRadius: 12 }],
  }), []);

  const revenueDistribution = useMemo(() => ({
    labels: ['Online', 'In-store', 'Bulk B2B'],
    datasets: [{ data: [46, 34, 20], backgroundColor: ['#1F5C4A', '#406F60', '#D0A86E'], borderWidth: 0 }],
  }), []);

  const filteredProducts = retailerProducts.filter((item) => [item.name, item.category, item.sku].join(' ').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={cn('min-h-screen', theme.bg)}>
      <div className={cn('min-h-screen', theme.shell)}>
        <div className="flex min-h-screen">
          <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r px-4 py-5 lg:flex lg:flex-col', theme.border, theme.sidebar, collapsed ? 'w-[92px]' : 'w-[280px]')}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1f5c4a] text-white shadow-[0_14px_34px_rgba(31,92,74,0.35)]">N</div>
                {!collapsed ? <div><p className={cn('font-semibold', theme.text)}>Nasuo Hive</p><p className={cn('text-xs', theme.mute)}>Retailer Portal</p></div> : null}
              </div>
              <button onClick={() => setCollapsed((prev) => !prev)} className={cn('rounded-xl p-2', darkMode ? 'bg-white/10 text-white' : 'bg-[#f3ede5] text-[#1f5c4a]')}>
                <RetailerIcon name="chevron" className={cn('h-4 w-4 transition', collapsed ? 'rotate-180' : '')} />
              </button>
            </div>
            <div className="space-y-1.5">
              {retailerNavItems.map((item) => (
                <button key={item.key} onClick={() => setActiveSection(item.key)} className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition', activeSection === item.key ? 'bg-[#1f5c4a] text-white shadow-[0_16px_34px_rgba(31,92,74,0.22)]' : darkMode ? 'text-slate-300 hover:bg-white/6' : 'text-[#526860] hover:bg-[#f3ece3]')}>
                  <RetailerIcon name={item.icon} className="h-5 w-5 shrink-0" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </button>
              ))}
            </div>
            <RetailerCard dark={darkMode} className="mt-auto"><p className="text-sm font-semibold">Retail health</p><p className={cn('mt-2 text-xs leading-5', theme.sub)}>Price intelligence and demand signals are aligned across 84% of key SKUs.</p></RetailerCard>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className={cn('sticky top-0 z-30 border-b px-4 py-4 backdrop-blur-xl sm:px-6', theme.border, darkMode ? 'bg-[#0b1220]/80' : 'bg-[#f6f0e7]/80')}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f5c4a] text-white lg:hidden">N</div>
                  <div className={cn('flex items-center gap-3 rounded-[20px] border px-4 py-3', theme.border, darkMode ? 'bg-white/5' : 'bg-white/80')}>
                    <RetailerIcon name="search" className={cn('h-4 w-4', theme.mute)} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, suppliers, customers, or invoices" className={cn('w-[220px] bg-transparent text-sm outline-none md:w-[360px]', theme.text, darkMode ? 'placeholder:text-slate-500' : 'placeholder:text-[#8a9991]')} />
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end xl:self-auto">
                  <button onClick={() => setDarkMode((prev) => !prev)} className={cn('rounded-2xl px-4 py-2.5 text-sm font-medium', darkMode ? 'bg-white text-[#0b1220]' : 'bg-[#1f5c4a] text-white')}>{darkMode ? 'Light mode' : 'Dark mode'}</button>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className={cn('rounded-2xl border px-3 py-2.5 text-sm', theme.border, darkMode ? 'bg-white/5 text-white' : 'bg-white text-[#17342a]')}><option>EN</option><option>HI</option><option>TE</option></select>
                  <button className={cn('rounded-2xl border p-3', theme.border, darkMode ? 'bg-white/5 text-white' : 'bg-white text-[#17342a]')}><RetailerIcon name="bell" className="h-5 w-5" /></button>
                  <button className={cn('rounded-2xl border p-3', theme.border, darkMode ? 'bg-white/5 text-white' : 'bg-white text-[#17342a]')}><RetailerIcon name="cart" className="h-5 w-5" /></button>
                  <div className="relative">
                    <button onClick={() => setProfileOpen((prev) => !prev)} className={cn('flex items-center gap-3 rounded-2xl border px-3 py-2', theme.border, darkMode ? 'bg-white/5 text-white' : 'bg-white text-[#17342a]')}>
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#d7c7ad] text-[#17342a]">AR</div>
                      <div className="hidden text-left sm:block"><p className="text-sm font-semibold">A. Rami</p><p className={cn('text-xs', theme.mute)}>Retail Ops Lead</p></div>
                    </button>
                    <AnimatePresence>
                      {profileOpen ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={cn('absolute right-0 top-full z-20 mt-2 w-48 rounded-[18px] border p-2 shadow-xl', theme.border, darkMode ? 'bg-[#101827]' : 'bg-white')}>{['Profile', 'Workspace', 'Sign out'].map((item) => <button key={item} className={cn('block w-full rounded-xl px-3 py-2 text-left text-sm', darkMode ? 'text-slate-200 hover:bg-white/6' : 'text-[#35584b] hover:bg-[#f4eee7]')}>{item}</button>)}</motion.div> : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-[1600px] space-y-6">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className={cn('text-xs uppercase tracking-[0.28em]', theme.mute)}>Retailer Commerce Hub</p>
                    <h1 className={cn('mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl', theme.text)}>Buy smarter, compare manufacturers, and sell with precision.</h1>
                    <p className={cn('mt-3 max-w-3xl text-sm leading-6 sm:text-base', theme.sub)}>A polished retailer workspace for procurement, pricing intelligence, fulfillment, POS, customer loyalty, and operational reporting inside the Nasuo Hive ecosystem.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <RetailerAction dark={darkMode}>Add Product</RetailerAction>
                    <RetailerAction dark={darkMode}>Compare Prices</RetailerAction>
                    <RetailerAction dark={darkMode}>Create Order</RetailerAction>
                    <RetailerAction dark={darkMode}>Generate Invoice</RetailerAction>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {retailerStats.map((item) => <RetailerStat key={item.label} item={item} dark={darkMode} />)}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <RetailerCard dark={darkMode}>
                    <RetailerSectionHeader dark={darkMode} title="Sales trend" description="Daily sales velocity across channels and wholesale accounts." />
                    <div className="h-[280px]"><Line data={salesTrend} options={chartOptions} /></div>
                  </RetailerCard>
                  <RetailerCard dark={darkMode}>
                    <RetailerSectionHeader dark={darkMode} title="Top selling products" description="Best-performing SKUs in the current cycle." />
                    <div className="h-[280px]"><Bar data={topSelling} options={chartOptions} /></div>
                  </RetailerCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.05fr_0.95fr]">
                  <RetailerCard dark={darkMode}>
                    <RetailerSectionHeader dark={darkMode} title="Revenue distribution" description="Mix across revenue channels." />
                    <div className="mx-auto h-[240px] max-w-[260px]"><Doughnut data={revenueDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: darkMode ? '#e2e8f0' : '#475c54' } } } }} /></div>
                  </RetailerCard>
                  <RetailerCard dark={darkMode}>
                    <RetailerSectionHeader dark={darkMode} title="Recent activity" description="Orders, stock alerts, and supplier updates." />
                    <div className="space-y-3">{retailerRecentActivity.map((item) => <div key={item.title} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e8decf] bg-[#fcfaf6]')}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{item.title}</p><p className={cn('mt-1 text-sm', theme.sub)}>{item.meta}</p></div><RetailerBadge dark={darkMode} value={item.status} /></div></div>)}</div>
                  </RetailerCard>
                  <RetailerCard dark={darkMode}>
                    <RetailerSectionHeader dark={darkMode} title="Smart alerts" description="Actionable recommendations and margin signals." />
                    <div className="space-y-3">{retailerAlerts.map((item) => <div key={item.label} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e8decf] bg-[#fcfaf6]')}><div className="flex items-center justify-between gap-3"><p className="font-medium">{item.label}</p><RetailerBadge dark={darkMode} value={item.tone} /></div><p className={cn('mt-2 text-sm', theme.sub)}>{item.detail}</p></div>)}</div>
                  </RetailerCard>
                </div>

                <div className="grid gap-3 overflow-x-auto pb-1 md:grid-cols-2 xl:grid-cols-6">
                  {retailerNavItems.filter((item) => item.key !== 'dashboard').map((item) => (
                    <button key={item.key} onClick={() => setActiveSection(item.key)} className={cn('min-w-[180px] rounded-[18px] border px-4 py-3 text-left transition', activeSection === item.key ? 'border-[#1f5c4a] bg-[#1f5c4a] text-white shadow-[0_18px_30px_rgba(31,92,74,0.22)]' : darkMode ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/8' : 'border-[#e5dbcd] bg-white/70 text-[#24443a] hover:bg-white')}>
                      <p className="text-sm font-semibold">{item.label}</p>
                    </button>
                  ))}
                </div>

                <motion.div key={activeSection} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  {(activeSection === 'dashboard' || activeSection === 'products') && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Product management" description="Add, edit, filter, and manage retail-facing product information." />
                      <div className="mb-4 flex flex-col gap-3 md:flex-row">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories, or SKU" className={cn('w-full rounded-2xl border px-4 py-3 text-sm outline-none', darkMode ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500' : 'border-[#e3d7c6] bg-[#fcfaf6] text-[#17342a]')} />
                        <div className="flex gap-2"><RetailerAction dark={darkMode}>All categories</RetailerAction><RetailerAction dark={darkMode}>In stock</RetailerAction></div>
                      </div>
                      <div className="overflow-hidden rounded-[18px] border border-inherit">
                        <table className="w-full text-left text-sm">
                          <thead className={cn(darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                            <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                              <th className="px-4 py-3 font-medium">SKU</th><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((row) => <tr key={row.sku} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#ede4d7]')}><td className="px-4 py-3 font-medium">{row.sku}</td><td className="px-4 py-3">{row.name}</td><td className="px-4 py-3">{row.category}</td><td className="px-4 py-3">{row.price}</td><td className="px-4 py-3">{row.stock}</td><td className="px-4 py-3"><RetailerBadge dark={darkMode} value={row.status} /></td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </RetailerCard>
                  )}

                  {activeSection === 'inventory' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Inventory management" description="Low stock tracking, warehouse coverage, and restocking controls." />
                      <div className="grid gap-4 md:grid-cols-3">{retailerInventory.map((item) => <RetailerCard key={item.location} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><div className="flex items-center justify-between"><p className="font-semibold">{item.location}</p><RetailerBadge dark={darkMode} value={item.status} /></div><div className={cn('mt-4 h-2 rounded-full', darkMode ? 'bg-white/10' : 'bg-[#ece3d7]')}><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div><div className="mt-3 flex items-center justify-between text-sm"><span className={theme.sub}>Fill {item.fill}%</span><span className={theme.sub}>{item.stock}</span></div></RetailerCard>)}</div>
                    </RetailerCard>
                  )}

                  {activeSection === 'suppliers' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Supplier management" description="Profiles, purchase history, and payment standing across manufacturers." />
                      <div className="grid gap-4 md:grid-cols-3">{retailerSuppliers.map((item) => <RetailerCard key={item.name} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">{item.name}</p><div className="mt-4 space-y-2 text-sm"><div className="flex items-center justify-between"><span className={theme.sub}>Products</span><span>{item.products}</span></div><div className="flex items-center justify-between"><span className={theme.sub}>Purchase history</span><span>{item.purchaseHistory}</span></div><div className="flex items-center justify-between"><span className={theme.sub}>Payment</span><RetailerBadge dark={darkMode} value={item.payment} /></div></div></RetailerCard>)}</div>
                    </RetailerCard>
                  )}

                  {activeSection === 'price-comparison' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Price comparison" description="Compare the same product from multiple manufacturers and surface the best option." action={<RetailerAction dark={darkMode}>Auto-select best</RetailerAction>} />
                      <div className="space-y-4">{priceComparisons.map((item) => <ComparisonCard key={item.manufacturer} item={item} dark={darkMode} />)}</div>
                    </RetailerCard>
                  )}

                  {activeSection === 'orders' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Order management" description="Place bulk orders, track lifecycle status, and manage returns or cancellations." />
                      <div className="overflow-hidden rounded-[18px] border border-inherit">
                        <table className="w-full text-left text-sm">
                          <thead className={cn(darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                            <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                              <th className="px-4 py-3 font-medium">Order</th><th className="px-4 py-3 font-medium">Supplier</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {retailerOrders.map((row) => <tr key={row.id} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#ede4d7]')}><td className="px-4 py-3 font-medium">{row.id}</td><td className="px-4 py-3">{row.supplier}</td><td className="px-4 py-3">{row.total}</td><td className="px-4 py-3"><RetailerBadge dark={darkMode} value={row.status} /></td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </RetailerCard>
                  )}

                  {activeSection === 'billing' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Billing and POS" description="Invoice generation, GST workflow, barcode scan placeholder, and payment collection." />
                      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                        <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Receipt preview</p><div className="mt-4 rounded-[18px] border border-dashed border-inherit p-6 text-sm"><p>Invoice #POS-2184</p><p className="mt-2">GST included · Barcode scanner ready for integration</p></div></RetailerCard>
                        <div className="space-y-4">
                          <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Payment methods</p><div className="mt-4 space-y-3">{posPayments.map((item) => <div key={item.type} className="rounded-[18px] border border-inherit px-4 py-3"><p className="font-medium">{item.type}</p><p className={cn('mt-1 text-sm', theme.sub)}>{item.detail}</p></div>)}</div></RetailerCard>
                          <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">GST breakdown</p><p className={cn('mt-3 text-sm', theme.sub)}>Taxable value $6,840 · GST $1,231 · Grand total $8,071</p></RetailerCard>
                        </div>
                      </div>
                    </RetailerCard>
                  )}

                  {activeSection === 'customers' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Customer management" description="Profiles, purchase history, loyalty tiers, and discount control." />
                      <div className="grid gap-4 md:grid-cols-3">{retailerCustomers.map((item) => <RetailerCard key={item.name} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">{item.name}</p><div className="mt-4 space-y-2 text-sm"><div className="flex items-center justify-between"><span className={theme.sub}>Lifetime</span><span>{item.lifetime}</span></div><div className="flex items-center justify-between"><span className={theme.sub}>Loyalty</span><RetailerBadge dark={darkMode} value={item.loyalty === 'Gold' ? 'Approved' : item.loyalty === 'Silver' ? 'Inspection' : 'Draft'} /></div><div className="flex items-center justify-between"><span className={theme.sub}>Discount</span><span>{item.discount}</span></div></div></RetailerCard>)}</div>
                    </RetailerCard>
                  )}

                  {activeSection === 'payments' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Payment management" description="Transactions, refunds, and settlement reporting." />
                      <div className="overflow-hidden rounded-[18px] border border-inherit">
                        <table className="w-full text-left text-sm">
                          <thead className={cn(darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                            <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                              <th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Method</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {retailerPayments.map((row) => <tr key={row.id} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#ede4d7]')}><td className="px-4 py-3 font-medium">{row.id}</td><td className="px-4 py-3">{row.method}</td><td className="px-4 py-3">{row.amount}</td><td className="px-4 py-3"><RetailerBadge dark={darkMode} value={row.status} /></td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </RetailerCard>
                  )}

                  {activeSection === 'offers' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Offers and promotions" description="Create discounts, manage coupons, and launch campaign benefits." />
                      <div className="grid gap-4 md:grid-cols-3">{retailerOffers.map((item) => <RetailerCard key={item.name} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">{item.name}</p><div className="mt-4 space-y-2 text-sm"><div className="flex items-center justify-between"><span className={theme.sub}>Reach</span><span>{item.reach}</span></div><div className="flex items-center justify-between"><span className={theme.sub}>Discount</span><span>{item.discount}</span></div><div className="flex items-center justify-between"><span className={theme.sub}>State</span><RetailerBadge dark={darkMode} value={item.state} /></div></div></RetailerCard>)}</div>
                    </RetailerCard>
                  )}

                  {activeSection === 'reports' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Reports and analytics" description="Sales, profit, inventory, and customer insight reporting." />
                      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">{retailerReports.map((item) => <RetailerCard key={item.title} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="text-sm font-medium">{item.title}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className={cn('mt-2 text-sm', theme.sub)}>{item.note}</p></RetailerCard>)}</div>
                        <div className="space-y-4">
                          <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Loading state</p><div className="mt-4 space-y-3"><RetailerSkeleton dark={darkMode} className="h-10 w-2/3" /><RetailerSkeleton dark={darkMode} className="h-20 w-full" /><RetailerSkeleton dark={darkMode} className="h-20 w-full" /></div></RetailerCard>
                          <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Success and error states</p><div className={cn('mt-4 rounded-2xl border px-4 py-4 text-sm', darkMode ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-[#cce1d4] bg-[#eef8f1] text-[#2d6a50]')}>Sales summary exported successfully.</div><div className={cn('mt-3 rounded-2xl border px-4 py-4 text-sm', darkMode ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-[#e7c3b8] bg-[#fff3f0] text-[#9b5646]')}>Refund sync pending for 2 transactions.</div></RetailerCard>
                        </div>
                      </div>
                    </RetailerCard>
                  )}

                  {activeSection === 'settings' && (
                    <RetailerCard dark={darkMode}>
                      <RetailerSectionHeader dark={darkMode} title="Settings" description="Theme, language, workspace defaults, and notification preferences." />
                      <div className="grid gap-4 md:grid-cols-2">
                        <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Appearance</p><div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Dark mode</span><button onClick={() => setDarkMode((prev) => !prev)} className={cn('rounded-full px-3 py-1 text-xs font-semibold', darkMode ? 'bg-white text-[#0b1220]' : 'bg-[#1f5c4a] text-white')}>{darkMode ? 'Enabled' : 'Enable'}</button></div></RetailerCard>
                        <RetailerCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="font-semibold">Locale</p><div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Language</span><select value={language} onChange={(e) => setLanguage(e.target.value)} className={cn('rounded-xl border px-3 py-2 text-sm', darkMode ? 'border-white/10 bg-[#0f1726] text-white' : 'border-[#e4d7c7] bg-white text-[#18352c]')}><option>EN</option><option>HI</option><option>TE</option></select></div></RetailerCard>
                      </div>
                    </RetailerCard>
                  )}
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDashboard;
