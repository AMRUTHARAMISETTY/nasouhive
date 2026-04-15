import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  inventoryBuckets,
  machineCards,
  manufacturerAlerts,
  manufacturerNavItems,
  manufacturerRecentActivity,
  manufacturerStats,
  manufacturingSteps,
  productionSchedule,
  qualityReports,
  quotationOrders,
  rawMaterials,
  reportCards,
  supplyChainItems,
  warehouses,
} from '../data/manufacturerDashboardData';
import { ActionButton, cn, Icon, MiniStat, SectionHeader, SkeletonBlock, StatusBadge, ThemeCard, TooltipChip } from '../components/manufacturer/ManufacturerUI';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const stateToBadge = { info: 'Running', warning: 'Low', danger: 'Critical', success: 'Approved' };

const chartBase = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#475c54', boxWidth: 12, boxHeight: 12 } } },
  scales: {
    x: { ticks: { color: '#71837c' }, grid: { color: 'rgba(31,92,74,0.06)' } },
    y: { ticks: { color: '#71837c' }, grid: { color: 'rgba(31,92,74,0.06)' } },
  },
});

function ManufacturerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const darkMode = false;
  const colors = {
    bg: 'bg-[#f4ede3]',
    shell: 'bg-[radial-gradient(circle_at_top_left,rgba(31,92,74,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(215,199,173,0.42),transparent_18%),linear-gradient(180deg,#f6f0e6_0%,#efe7da_100%)]',
    border: 'border-[#e2d8ca]',
    text: 'text-[#17342a]',
    subtext: 'text-[#5d7168]',
    muted: 'text-[#778981]',
    sidebar: 'bg-white/72',
  };

  const productionTrendData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Production', data: [12400, 13850, 13200, 14900, 16220, 15840, 18420], borderColor: '#1F5C4A', backgroundColor: 'rgba(31,92,74,0.15)', fill: true, tension: 0.35, pointRadius: 0 }],
  }), []);

  const ordersVsDeliveriesData = useMemo(() => ({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{ label: 'Orders', data: [42, 55, 61, 72], backgroundColor: '#1F5C4A', borderRadius: 10 }, { label: 'Deliveries', data: [38, 49, 57, 68], backgroundColor: '#D7C7AD', borderRadius: 10 }],
  }), []);

  const inventoryDistributionData = useMemo(() => ({
    labels: ['Raw Materials', 'WIP', 'Finished'],
    datasets: [{ data: [41, 23, 36], backgroundColor: ['#1F5C4A', '#6FA695', '#D7C7AD'], borderWidth: 0 }],
  }), []);

  const filteredMaterials = rawMaterials.filter((row) => [row.name, row.supplier].join(' ').toLowerCase().includes(search.toLowerCase()));

  const moduleTabs = useMemo(() => [
    { key: 'raw-materials', title: 'Raw Material Management' },
    { key: 'planning', title: 'Production Planning' },
    { key: 'manufacturing', title: 'Manufacturing' },
    { key: 'inventory', title: 'Inventory' },
    { key: 'quality', title: 'Quality Control' },
    { key: 'machines', title: 'Machines' },
    { key: 'supply-chain', title: 'Supply Chain' },
    { key: 'orders', title: 'Orders' },
    { key: 'warehouses', title: 'Warehouses' },
    { key: 'reports', title: 'Reports & Analytics' },
    { key: 'settings', title: 'Settings' },
  ], []);

  const activeModule = activeSection === 'dashboard' ? moduleTabs[0] : moduleTabs.find((item) => item.key === activeSection) ?? moduleTabs[0];

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <div className={cn('min-h-screen', colors.shell)}>
        <div className="flex min-h-screen">
          <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r px-4 py-5 lg:flex lg:flex-col', colors.border, colors.sidebar, sidebarCollapsed ? 'w-[92px]' : 'w-[280px]')}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1f5c4a] text-white shadow-[0_14px_34px_rgba(31,92,74,0.35)]">N</div>
                {!sidebarCollapsed ? <div><p className={cn('font-semibold', colors.text)}>Nasuo Hive</p><p className={cn('text-xs', colors.muted)}>Manufacturer Portal</p></div> : null}
              </div>
              <button onClick={() => setSidebarCollapsed((prev) => !prev)} className="rounded-xl bg-[#f3ede5] p-2 text-[#1f5c4a]">
                <Icon name="chevron" className={cn('h-4 w-4 transition', sidebarCollapsed ? 'rotate-180' : '')} />
              </button>
            </div>
            <div className="space-y-1.5">
              {manufacturerNavItems.map((item) => (
                <button key={item.key} onClick={() => setActiveSection(item.key)} className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition', activeSection === item.key ? 'bg-[#1f5c4a] text-white shadow-[0_16px_34px_rgba(31,92,74,0.22)]' : 'text-[#526860] hover:bg-[#f3ece3]')}>
                  <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : null}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className={cn('sticky top-0 z-30 border-b bg-[#f6f0e7]/80 px-4 py-4 backdrop-blur-xl sm:px-6', colors.border)}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f5c4a] text-white lg:hidden">N</div>
                  <div className={cn('flex items-center gap-3 rounded-[20px] border bg-white/80 px-4 py-3', colors.border)}>
                    <Icon name="search" className={cn('h-4 w-4', colors.muted)} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search production batches, SKUs, or suppliers" className={cn('w-[220px] bg-transparent text-sm outline-none placeholder:text-[#8a9991] md:w-[360px]', colors.text)} />
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end xl:self-auto">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className={cn('rounded-2xl border bg-white px-3 py-2.5 text-sm text-[#17342a]', colors.border)}><option>EN</option><option>HI</option><option>TE</option></select>
                  <button className={cn('rounded-2xl border bg-white p-3 text-[#17342a]', colors.border)}><Icon name="bell" className="h-5 w-5" /></button>
                  <div className="relative">
                    <button onClick={() => setShowProfileMenu((prev) => !prev)} className={cn('flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 text-[#17342a]', colors.border)}>
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#d7c7ad] text-[#17342a]">AR</div>
                      <div className="hidden text-left sm:block"><p className="text-sm font-semibold">A. Rami</p><p className={cn('text-xs', colors.muted)}>Plant Admin</p></div>
                    </button>
                    <AnimatePresence>
                      {showProfileMenu ? (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={cn('absolute right-0 top-full z-20 mt-2 w-48 rounded-[18px] border bg-white p-2 shadow-xl', colors.border)}>
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
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className={cn('text-xs uppercase tracking-[0.28em]', colors.muted)}>Manufacturer Operations</p>
                    <h1 className={cn('mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl', colors.text)}>Enterprise control for production, warehousing, and supply chain velocity.</h1>
                    <p className={cn('mt-3 max-w-3xl text-sm leading-6 sm:text-base', colors.subtext)}>A premium operating layer for monitoring plant output, inventory risk, order flow, and logistics across the Nasuo Hive network.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <ActionButton dark={darkMode}>Add Product</ActionButton>
                    <ActionButton dark={darkMode}>Create Work Order</ActionButton>
                    <ActionButton dark={darkMode}>Update Stock</ActionButton>
                    <ActionButton dark={darkMode}>Approve Orders</ActionButton>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {manufacturerStats.map((item) => <MiniStat key={item.label} item={item} dark={darkMode} />)}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <ThemeCard dark={darkMode}>
                    <SectionHeader dark={darkMode} title="Production trend" description="Weekly output trend across active manufacturing lines." />
                    <div className="h-[280px]"><Line data={productionTrendData} options={chartBase()} /></div>
                  </ThemeCard>
                  <ThemeCard dark={darkMode}>
                    <SectionHeader dark={darkMode} title="Orders vs deliveries" description="Retailer demand versus completed deliveries." />
                    <div className="h-[280px]"><Bar data={ordersVsDeliveriesData} options={chartBase()} /></div>
                  </ThemeCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.05fr_0.9fr]">
                  <ThemeCard dark={darkMode}>
                    <SectionHeader dark={darkMode} title="Inventory distribution" description="Capital concentration across inventory stages." />
                    <div className="mx-auto h-[240px] max-w-[260px]"><Doughnut data={inventoryDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#475c54' } } } }} /></div>
                  </ThemeCard>
                  <ThemeCard dark={darkMode}>
                    <SectionHeader dark={darkMode} title="Recent activity" description="Live operational events from orders, shipments, and stock alerts." />
                    <div className="space-y-3">
                      {manufacturerRecentActivity.map((item) => (
                        <div key={item.title} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e8decf] bg-[#fcfaf6]')}>
                          <div className="flex items-start justify-between gap-3">
                            <div><p className="font-medium">{item.title}</p><p className={cn('mt-1 text-sm', colors.subtext)}>{item.meta}</p></div>
                            <StatusBadge dark={darkMode} value={stateToBadge[item.state]} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ThemeCard>
                  <ThemeCard dark={darkMode}>
                    <SectionHeader dark={darkMode} title="Smart alerts" description="AI-informed risk flags surfaced before SLA impact." />
                    <div className="space-y-3">
                      {manufacturerAlerts.map((item) => (
                        <div key={item.label} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e8decf] bg-[#fcfaf6]')}>
                          <div className="flex items-center justify-between gap-3"><p className="font-medium">{item.label}</p><StatusBadge dark={darkMode} value={item.label} /></div>
                          <p className={cn('mt-2 text-sm', colors.subtext)}>{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </ThemeCard>
                </div>

                <div className="grid gap-3 overflow-x-auto pb-1 md:grid-cols-2 xl:grid-cols-6">
                  {moduleTabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={cn(
                        'min-w-[180px] rounded-[18px] border px-4 py-3 text-left transition',
                        activeSection === item.key
                          ? 'border-[#1f5c4a] bg-[#1f5c4a] text-white shadow-[0_18px_30px_rgba(31,92,74,0.22)]'
                          : darkMode
                            ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/8'
                            : 'border-[#e5dbcd] bg-white/70 text-[#24443a] hover:bg-white',
                      )}
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                    </button>
                  ))}
                </div>

                <motion.div key={activeModule.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {activeModule.key === 'raw-materials' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Raw material command" description="Search, filter, and monitor stock, supplier quality, and exception flags." action={<TooltipChip dark={darkMode} label="Supplier risk" tip="Computed from lead time volatility, quality holds, and fulfillment history." />} />
                      <div className="mb-4 flex flex-col gap-3 md:flex-row">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials or suppliers" className={cn('w-full rounded-2xl border px-4 py-3 text-sm outline-none', darkMode ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500' : 'border-[#e3d7c6] bg-[#fcfaf6] text-[#17342a]')} />
                        <div className="flex gap-2"><ActionButton dark={darkMode}>All status</ActionButton><ActionButton dark={darkMode}>Approved quality</ActionButton></div>
                      </div>
                      <div className="overflow-hidden rounded-[18px] border border-inherit">
                        <div className={cn('max-h-[300px] overflow-auto', darkMode ? 'bg-[#0f1726]/50' : 'bg-[#fcfaf6]')}>
                          <table className="w-full text-left text-sm">
                            <thead className={cn('sticky top-0 z-10', darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                              <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                                <th className="px-4 py-3 font-medium">Material</th><th className="px-4 py-3 font-medium">Supplier</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Quality</th><th className="px-4 py-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredMaterials.map((row) => (
                                <tr key={row.name} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#ede4d7]')}>
                                  <td className="px-4 py-3 font-medium">{row.name}</td><td className="px-4 py-3">{row.supplier}</td><td className="px-4 py-3">{row.stock}</td><td className="px-4 py-3"><StatusBadge dark={darkMode} value={row.quality} /></td><td className="px-4 py-3"><StatusBadge dark={darkMode} value={row.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs"><span className={colors.muted}>Showing 1-4 of 42 materials</span><div className="flex gap-2"><ActionButton dark={darkMode}>Previous</ActionButton><ActionButton dark={darkMode}>Next</ActionButton></div></div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'planning' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Schedule and batch planning" description="A drag-and-drop style planning board for work orders, shift allocation, and line balancing." action={<ActionButton dark={darkMode}>Create schedule</ActionButton>} />
                      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                        <div className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e7ddcf] bg-[#fcfaf6]')}>
                          <div className="mb-4 flex items-center justify-between"><p className="font-medium">Calendar lane</p><StatusBadge dark={darkMode} value="Running" /></div>
                          <div className="space-y-3">
                            {productionSchedule.map((item) => (
                              <motion.div key={item.time} whileHover={{ y: -2 }} className={cn('rounded-2xl border p-4', darkMode ? 'border-white/10 bg-[#111a27]' : 'border-[#ede3d6] bg-white')}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                            <div><p className="text-xs uppercase tracking-[0.24em] text-[#7d9389]">{item.time}</p><p className="mt-1 font-semibold">{item.job}</p><p className="mt-1 text-sm text-[#6a7f76]">{item.line} · {item.assignee}</p></div>
                                  <StatusBadge dark={darkMode} value={item.status} />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                            <p className="text-sm font-semibold">Planning assistant</p>
                            <p className={cn('mt-2 text-sm leading-6', darkMode ? 'text-slate-300' : 'text-[#60736b]')}>AI demand prediction suggests increasing tomorrow&apos;s bottle output by 14% to absorb retailer demand spikes in the west region.</p>
                            <div className={cn('mt-4 rounded-2xl border p-4', darkMode ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-[#d7eadf] bg-[#eff8f2]')}>
                              <p className="text-xs uppercase tracking-[0.24em] text-[#5c8a76]">Prediction confidence</p><p className="mt-2 text-3xl font-semibold">86%</p>
                            </div>
                          </ThemeCard>
                          <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                            <p className="text-sm font-semibold">Empty state</p>
                            <div className={cn('mt-4 rounded-[18px] border border-dashed p-6 text-center', darkMode ? 'border-white/10 text-slate-400' : 'border-[#dacdbd] text-[#70817b]')}>No unassigned batches. New work orders created today will appear here.</div>
                          </ThemeCard>
                        </div>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'manufacturing' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Processing pipeline" description="Track each production stage, worker assignment, and live throughput." />
                      <div className="grid gap-4 md:grid-cols-3">
                        {manufacturingSteps.map((step) => (
                          <ThemeCard key={step.name} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                            <div className="flex items-center justify-between"><p className="font-semibold">{step.name}</p><StatusBadge dark={darkMode} value={step.status} /></div>
                            <div className={cn('mt-4 h-2 rounded-full', darkMode ? 'bg-white/10' : 'bg-[#ebe3d7]')}><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${step.progress}%` }} /></div>
                            <div className="mt-3 flex items-center justify-between text-sm"><span className={colors.subtext}>{step.progress}% complete</span><span className={colors.subtext}>{step.workers} workers</span></div>
                          </ThemeCard>
                        ))}
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'inventory' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Inventory control" description="Track raw materials, work-in-progress, finished goods, and threshold alerts." />
                      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                          {inventoryBuckets.map((item) => <ThemeCard key={item.label} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="text-sm font-medium">{item.label}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className={cn('mt-1 text-sm', darkMode ? 'text-slate-400' : 'text-[#70817a]')}>{item.amount}</p></ThemeCard>)}
                        </div>
                        <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                          <p className="font-semibold">Stock alert stack</p>
                          <div className="mt-4 space-y-3">
                            {manufacturerAlerts.map((alert) => (
                              <div key={alert.label} className={cn('rounded-2xl border p-4', darkMode ? 'border-white/10 bg-[#111a27]' : 'border-[#ede2d4] bg-white')}>
                                <div className="flex items-center justify-between gap-3"><p className="font-medium">{alert.label}</p><StatusBadge dark={darkMode} value={alert.label} /></div>
                                <p className={cn('mt-2 text-sm', darkMode ? 'text-slate-400' : 'text-[#6a7d76]')}>{alert.detail}</p>
                              </div>
                            ))}
                          </div>
                        </ThemeCard>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'quality' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Inspection reports" description="Defect tracking, compliance checkpoints, and pass/fail views by batch." />
                      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="overflow-hidden rounded-[18px] border border-inherit">
                          <table className="w-full text-left text-sm">
                            <thead className={cn(darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                              <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                                <th className="px-4 py-3 font-medium">Batch</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Defects</th><th className="px-4 py-3 font-medium">Inspector</th>
                              </tr>
                            </thead>
                            <tbody>
                              {qualityReports.map((row) => (
                                <tr key={row.batch} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#eee3d6]')}>
                                  <td className="px-4 py-3 font-medium">{row.batch}</td><td className="px-4 py-3"><StatusBadge dark={darkMode} value={row.result} /></td><td className="px-4 py-3">{row.defects}</td><td className="px-4 py-3">{row.inspector}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                          <p className="font-semibold">Compliance checklist</p>
                          <div className="mt-4 space-y-3 text-sm">
                            {['Sanitation verified', 'Traceability labels synced', 'Export packaging passed', 'Audit trail recorded'].map((item, idx) => <div key={item} className="flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>{item}</span><StatusBadge dark={darkMode} value={idx === 2 ? 'Inspection' : 'Approved'} /></div>)}
                          </div>
                        </ThemeCard>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'machines' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Machine operations" description="Performance metrics, uptime, and maintenance windows across equipment." />
                      <div className="grid gap-4 md:grid-cols-3">
                        {machineCards.map((machine) => (
                          <motion.div key={machine.name} whileHover={{ y: -2 }} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e7ddcf] bg-[#fcfaf6]')}>
                            <div className="flex items-center justify-between"><p className="font-semibold">{machine.name}</p><StatusBadge dark={darkMode} value={machine.status} /></div>
                            <div className="mt-4 space-y-2 text-sm">
                              <div className="flex items-center justify-between"><span className={colors.subtext}>Utilization</span><span>{machine.utilization}</span></div>
                              <div className="flex items-center justify-between"><span className={colors.subtext}>Next service</span><span>{machine.nextService}</span></div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'supply-chain' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Logistics and delivery timelines" description="Vendor relationships, shipment progress, and outbound risk status." />
                      <div className="space-y-4">
                        {supplyChainItems.map((item) => (
                          <div key={item.vendor} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e7ddcf] bg-[#fcfaf6]')}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div><p className="font-semibold">{item.vendor}</p><p className={cn('mt-1 text-sm', darkMode ? 'text-slate-400' : 'text-[#6a7d76]')}>{item.route}</p></div>
                              <StatusBadge dark={darkMode} value={item.eta} />
                            </div>
                            <div className={cn('mt-4 h-2 rounded-full', darkMode ? 'bg-white/10' : 'bg-[#ece3d7]')}><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.progress}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'orders' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Orders management" description="Bulk retailer orders, approval actions, and status flow from requested to delivered." action={<ActionButton dark={darkMode}>Approve orders</ActionButton>} />
                      <div className="overflow-hidden rounded-[18px] border border-inherit">
                        <table className="w-full text-left text-sm">
                          <thead className={cn(darkMode ? 'bg-[#111a27]' : 'bg-[#f6efe6]')}>
                            <tr className={cn(darkMode ? 'text-slate-300' : 'text-[#567067]')}>
                              <th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Retailer</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Stage</th><th className="px-4 py-3 font-medium">Priority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quotationOrders.map((row) => (
                              <tr key={row.id} className={cn('border-t', darkMode ? 'border-white/6' : 'border-[#eee3d6]')}>
                                <td className="px-4 py-3 font-medium">{row.id}</td><td className="px-4 py-3">{row.retailer}</td><td className="px-4 py-3">{row.amount}</td><td className="px-4 py-3"><StatusBadge dark={darkMode} value={row.stage} /></td><td className="px-4 py-3"><StatusBadge dark={darkMode} value={row.priority} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'warehouses' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Warehouse network" description="Multi-location fill rates, stock distribution, and simplified map overview." />
                      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                        <div className={cn('rounded-[18px] border p-5', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e7ddcf] bg-[#fcfaf6]')}>
                          <div className="grid h-full min-h-[220px] place-items-center rounded-[18px] border border-dashed border-inherit text-center">
                            <div><p className="text-sm font-medium">Location map placeholder</p><p className={cn('mt-2 text-sm', darkMode ? 'text-slate-400' : 'text-[#6d8077]')}>Ready for map integration across warehouse clusters.</p></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {warehouses.map((item) => (
                            <div key={item.name} className={cn('rounded-[18px] border p-4', darkMode ? 'border-white/10 bg-white/5' : 'border-[#e7ddcf] bg-[#fcfaf6]')}>
                              <div className="flex items-center justify-between"><p className="font-semibold">{item.name}</p><span className={colors.subtext}>{item.temperature}</span></div>
                              <div className={cn('mt-4 h-2 rounded-full', darkMode ? 'bg-white/10' : 'bg-[#ece3d7]')}><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div>
                              <div className="mt-3 flex items-center justify-between text-sm"><span className={colors.subtext}>Fill rate {item.fill}%</span><span className={colors.subtext}>{item.skus} active SKUs</span></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'reports' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Performance insights" description="Executive analytics on efficiency, cost, waste, and operating trends." />
                      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                          {reportCards.map((item) => <ThemeCard key={item.title} dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}><p className="text-sm font-medium">{item.title}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className={cn('mt-2 text-sm', darkMode ? 'text-slate-400' : 'text-[#70817b]')}>{item.note}</p></ThemeCard>)}
                        </div>
                        <div className="space-y-4">
                          <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                            <p className="font-semibold">Loading state</p>
                            <div className="mt-4 space-y-3"><SkeletonBlock dark={darkMode} className="h-10 w-2/3" /><SkeletonBlock dark={darkMode} className="h-20 w-full" /><SkeletonBlock dark={darkMode} className="h-20 w-full" /></div>
                          </ThemeCard>
                          <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                            <p className="font-semibold">Success state</p>
                            <div className={cn('mt-4 rounded-2xl border px-4 py-4 text-sm', darkMode ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-[#cce1d4] bg-[#eef8f1] text-[#2d6a50]')}>Monthly efficiency report exported successfully and shared with leadership.</div>
                            <p className="mt-4 font-semibold">Error state</p>
                            <div className={cn('mt-3 rounded-2xl border px-4 py-4 text-sm', darkMode ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-[#e7c3b8] bg-[#fff3f0] text-[#9b5646]')}>Data sync interrupted for waste analysis. Retry once source systems are back online.</div>
                          </ThemeCard>
                        </div>
                      </div>
                    </ThemeCard>
                  )}

                  {activeModule.key === 'settings' && (
                    <ThemeCard dark={darkMode}>
                      <SectionHeader dark={darkMode} title="Portal preferences" description="Localization, export defaults, and dashboard preferences." />
                      <div className="grid gap-4 md:grid-cols-2">
                        <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                          <p className="font-semibold">Language</p>
                          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Current locale</span><select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-xl border border-[#e4d7c7] bg-white px-3 py-2 text-sm text-[#18352c]"><option>EN</option><option>HI</option><option>TE</option></select></div>
                        </ThemeCard>
                        <ThemeCard dark={darkMode} className={darkMode ? 'bg-white/5' : 'bg-[#fcfaf6]'}>
                          <p className="font-semibold">Exports</p>
                          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Default format</span><span className="text-sm font-medium text-[#35584b]">CSV + PDF</span></div>
                        </ThemeCard>
                      </div>
                    </ThemeCard>
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

export default ManufacturerDashboard;
