import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  inventoryBuckets,
  manufacturerAlerts,
  manufacturerRecentActivity,
  manufacturerStats,
  manufacturingSteps,
  machineCards,
  productionSchedule,
  qualityReports,
  quotationOrders,
  rawMaterials,
  reportCards,
  supplyChainItems,
  warehouses,
} from '../../data/manufacturerDashboardData';
import { ActionButton, cn, MiniStat, SectionHeader, SkeletonBlock, StatusBadge, ThemeCard, TooltipChip } from './ManufacturerUI';
import AddStockWizard from '../AddStockWizard';
import { MobileGlyph } from '../mobile/MobileAppShell';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const stateToBadge = { info: 'Running', warning: 'Low', danger: 'Critical', success: 'Approved' };

const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#255849', boxWidth: 12, boxHeight: 12 } } },
  scales: {
    x: { ticks: { color: '#255849' }, grid: { color: 'rgba(31,92,74,0.12)' } },
    y: { ticks: { color: '#255849' }, grid: { color: 'rgba(31,92,74,0.12)' } },
  },
};

const productionTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ label: 'Production', data: [12400, 13850, 13200, 14900, 16220, 15840, 18420], borderColor: '#1F5C4A', backgroundColor: 'rgba(31,92,74,0.15)', fill: true, tension: 0.35, pointRadius: 0 }],
};

const ordersVsDeliveriesData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{ label: 'Orders', data: [42, 55, 61, 72], backgroundColor: '#1F5C4A', borderRadius: 10 }, { label: 'Deliveries', data: [38, 49, 57, 68], backgroundColor: '#E5D8C7', borderRadius: 10 }],
};

const inventoryDistributionData = {
  labels: ['Raw Materials', 'WIP', 'Finished'],
  datasets: [{ data: [41, 23, 36], backgroundColor: ['#1F5C4A', '#255849', '#E5D8C7'], borderWidth: 0 }],
};

const dashboardActions = [
  { label: 'Add Product', icon: 'plus', to: '/app/manufacturer/inventory' },
  { label: 'Create Work Order', icon: 'orders', to: '/app/manufacturer/planning' },
  { label: 'Update Stock', icon: 'box', to: '/app/manufacturer/inventory' },
  { label: 'Approve Orders', icon: 'orders', to: '/app/manufacturer/orders' },
];

const insightCards = [
  { title: 'Demand Forecast', icon: 'chart', value: '+18%', text: 'Retailer demand for biodegradable packaging is expected to increase next week.' },
  { title: 'Inventory Optimization', icon: 'box', value: '240 units', text: 'Move stock from WH-03 to WH-01 to prevent an avoidable imbalance.' },
  { title: 'Production Recommendation', icon: 'factory', value: '+8%', text: 'Increase Line 2 capacity to meet the projected demand window.' },
];

const alertActions = {
  'Low stock': { label: 'View Inventory', to: '/app/manufacturer/inventory', status: 'Low' },
  'Machine downtime': { label: 'Review Schedule', to: '/app/manufacturer/planning', status: 'Maintenance' },
  'Delayed shipments': { label: 'View Orders', to: '/app/manufacturer/orders', status: 'Delayed' },
};

const manufacturerImageFallbacks = {
  'Raw Materials': 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
  WIP: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80',
  'Finished Goods': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
};

export function ManufacturerDashboardHome() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7D');

  const productionOptions = {
    ...chartBase,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      ...chartBase.plugins,
      legend: { display: false },
      tooltip: { backgroundColor: '#1F3B34', padding: 12, cornerRadius: 12, displayColors: false },
    },
    scales: {
      x: { ticks: { color: '#6B7F78' }, grid: { display: false } },
      y: { ticks: { color: '#6B7F78' }, grid: { color: 'rgba(31,92,74,0.08)' }, border: { display: false } },
    },
  };

  return (
    <div className="space-y-5 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[24px] border border-white/70 bg-[#1F5C4A] px-5 py-7 text-white shadow-[0_28px_70px_rgba(31,92,74,0.22)] sm:px-8 sm:py-9"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[38%] border-l border-white/10 bg-white/[0.035] lg:block" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.46fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E6ECEA]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Manufacturer Operations
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.05] text-white sm:text-4xl xl:text-[46px]">
              Enterprise control for production, warehousing &amp; supply chain velocity
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#E6ECEA]/85 sm:text-base">
              Monitor plant output, inventory risk, order flow and logistics across the Nasuo Hive network.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dashboardActions.map((action, index) => (
              <motion.button
                key={action.label}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.to)}
                className={cn(
                  'flex min-h-[76px] flex-col items-start justify-between rounded-[16px] border p-3 text-left text-xs font-bold transition',
                  index === 0 ? 'border-white bg-white text-[#1F5C4A]' : 'border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.13]',
                )}
              >
                <MobileGlyph name={action.icon} className="h-5 w-5" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {manufacturerStats.map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }} whileHover={{ y: -4, scale: 1.01 }}>
            <div className="relative min-h-[178px] overflow-hidden rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.09)] backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[72px] bg-[#E6ECEA]/75" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <p className="max-w-[150px] text-sm font-semibold leading-5 text-[#526A62]">{item.label}</p>
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', item.delta.startsWith('-') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{item.delta}</span>
                </div>
                <div className="mt-6">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 + index * 0.06 }} className="text-3xl font-semibold text-[#1F3B34] sm:text-[34px]">{item.value}</motion.p>
                  <p className="mt-2 text-xs leading-5 text-[#6B7F78]">{item.detail}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[#1F3B34]">Production Trend</p>
              <p className="mt-1 text-sm text-[#6B7F78]">Weekly output across active manufacturing lines</p>
            </div>
            <div className="flex rounded-xl bg-[#F1F4F2] p-1">
              {['7D', '30D', '90D'].map((range) => (
                <button key={range} type="button" onClick={() => setDateRange(range)} className={cn('h-8 rounded-lg px-3 text-xs font-bold transition', dateRange === range ? 'bg-white text-[#1F5C4A] shadow-sm' : 'text-[#6B7F78]')}>{range}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-3xl font-semibold text-[#1F3B34]">18,420</p>
            <p className="pb-1 text-xs font-bold text-emerald-600">+12.4% vs last period</p>
          </div>
          <div className="mt-3 h-[300px]"><Line data={productionTrendData} options={productionOptions} /></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
            <p className="text-base font-semibold text-[#1F3B34]">Orders vs Delivery</p>
            <p className="mt-1 text-xs text-[#6B7F78]">Retailer demand against completed delivery</p>
            <div className="mt-3 h-[185px]"><Bar data={ordersVsDeliveriesData} options={{ ...chartBase, plugins: { legend: { position: 'bottom', labels: { color: '#526A62', usePointStyle: true, boxWidth: 8 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#6B7F78' } }, y: { display: false } } }} /></div>
          </div>
          <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
            <p className="text-base font-semibold text-[#1F3B34]">Inventory Distribution</p>
            <p className="mt-1 text-xs text-[#6B7F78]">Capital across inventory stages</p>
            <div className="mx-auto mt-2 h-[185px] max-w-[220px]"><Doughnut data={inventoryDistributionData} options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { color: '#526A62', usePointStyle: true, boxWidth: 8 } } } }} /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <div className="mb-5">
            <p className="text-lg font-semibold text-[#1F3B34]">Recent Activity Feed</p>
            <p className="mt-1 text-sm text-[#6B7F78]">Live operational events from orders, shipments and stock alerts</p>
          </div>
          <div className="relative space-y-1 before:absolute before:bottom-5 before:left-[7px] before:top-5 before:w-px before:bg-[#D9E2DE]">
            {manufacturerRecentActivity.map((item) => (
              <div key={item.title} className="relative flex gap-4 py-3">
                <span className={cn('relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-[4px] border-white', item.state === 'danger' ? 'bg-rose-500' : item.state === 'warning' ? 'bg-amber-500' : item.state === 'success' ? 'bg-emerald-500' : 'bg-sky-500')} />
                <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                  <div><p className="text-sm font-semibold text-[#1F3B34]">{item.title}</p><p className="mt-1 text-xs text-[#758780]">{item.meta}</p></div>
                  <StatusBadge value={stateToBadge[item.state]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <div className="mb-5">
            <p className="text-lg font-semibold text-[#1F3B34]">Smart Alerts</p>
            <p className="mt-1 text-sm text-[#6B7F78]">AI-informed risks surfaced before SLA impact</p>
          </div>
          <div className="space-y-2">
            {manufacturerAlerts.map((item) => (
              <div key={item.label} className="rounded-[16px] border border-[#E7ECE9] bg-[#F7F9F8] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2"><StatusBadge value={alertActions[item.label].status} /><p className="text-sm font-bold capitalize text-[#1F3B34]">{item.label}</p></div>
                    <p className="mt-2 text-sm leading-5 text-[#61756E]">{item.detail}</p>
                  </div>
                  <button type="button" onClick={() => navigate(alertActions[item.label].to)} className="shrink-0 text-xs font-bold text-[#1F5C4A] hover:underline">{alertActions[item.label].label}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-[20px] bg-[#1F3B34] p-5 text-white shadow-[0_24px_60px_rgba(31,59,52,0.2)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold">AI Operations Insights</p>
            <p className="mt-1 text-sm text-[#C9D7D2]">Recommendations generated from production, inventory and demand signals</p>
          </div>
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#DCE7E3]">Updated 4 min ago</span>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {insightCards.map((insight) => (
            <motion.button key={insight.title} type="button" whileHover={{ y: -3 }} className="rounded-[16px] border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.11]">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><MobileGlyph name={insight.icon} className="h-4 w-4" /></span>
                <span className="text-sm font-semibold text-emerald-300">{insight.value}</span>
              </div>
              <p className="mt-4 text-sm font-semibold">{insight.title}</p>
              <p className="mt-2 text-xs leading-5 text-[#C9D7D2]">{insight.text}</p>
            </motion.button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-[#1F3B34]">Warehouse Snapshot</p>
            <p className="mt-1 text-sm text-[#6B7F78]">Capacity, stock utilization and risk across the network</p>
          </div>
          <button type="button" onClick={() => navigate('/app/manufacturer/warehouses')} className="text-xs font-bold text-[#1F5C4A] hover:underline">View all warehouses</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {warehouses.map((warehouse, index) => {
            const risk = warehouse.fill >= 80 ? 'Watch' : warehouse.fill < 55 ? 'Rebalance' : 'Stable';
            return (
              <motion.button key={warehouse.name} type="button" onClick={() => navigate('/app/manufacturer/warehouses')} whileHover={{ y: -4 }} className="rounded-[20px] border border-white/75 bg-white/88 p-5 text-left shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#758780]">Warehouse 0{index + 1}</p>
                    <p className="mt-1 text-base font-semibold text-[#1F3B34]">{warehouse.name}</p>
                  </div>
                  <StatusBadge value={risk === 'Stable' ? 'Healthy' : risk === 'Watch' ? 'Low' : 'Critical'} />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div><p className="text-3xl font-semibold text-[#1F3B34]">{warehouse.fill}%</p><p className="mt-1 text-xs text-[#758780]">Stock utilization</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-[#1F3B34]">{warehouse.skus} SKUs</p><p className="mt-1 text-xs text-[#758780]">{risk} risk</p></div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6ECEA]"><motion.div initial={{ width: 0 }} animate={{ width: `${warehouse.fill}%` }} transition={{ duration: 0.8, delay: index * 0.12 }} className={cn('h-full rounded-full', risk === 'Stable' ? 'bg-[#1F5C4A]' : risk === 'Watch' ? 'bg-amber-500' : 'bg-rose-500')} /></div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function RawMaterialsPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Raw Materials" description="Searchable table showing material name, supplier, quantity, and quality status." action={<TooltipChip label="Supplier risk" tip="Computed from lead time volatility, quality holds, and fulfillment history." />} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input placeholder="Search materials or suppliers" className="w-full rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]/60" />
        <div className="flex gap-2"><ActionButton>Add Material</ActionButton><ActionButton>Edit</ActionButton><ActionButton>Delete</ActionButton></div>
      </div>
      <div className="mb-4 flex gap-2"><ActionButton>Supplier</ActionButton><ActionButton>Status</ActionButton></div>
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <div className="max-h-[300px] overflow-auto bg-[#FFFFFF]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#EFEAE1]">
              <tr className="text-[#255849]">
                <th className="px-4 py-3 font-medium">Material Name</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Quality Status</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((row, index) => (
                <tr key={row.name} className="border-t border-[#E5D8C7]">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">{row.supplier}</td>
                  <td className="px-4 py-3">{row.stock}</td>
                  <td className="px-4 py-3"><StatusBadge value={row.quality} /></td>
                  <td className="px-4 py-3">Apr {14 - index}, 2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ThemeCard>
  );
}

export function ProductionPlanningPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Production Planning" description="Calendar-based schedule, work order list, and drag-and-drop style planning interface." action={<ActionButton>Create Work Order</ActionButton>} />
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
          <div className="mb-4 flex items-center justify-between"><p className="font-medium">Calendar View</p><StatusBadge value="Running" /></div>
          <div className="space-y-3">
            {productionSchedule.map((item) => (
              <motion.div key={item.time} whileHover={{ y: -2 }} className="rounded-2xl border border-[#E5D8C7] bg-[#EFEAE1] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs uppercase tracking-[0.24em] text-[#255849]">{item.time}</p><p className="mt-1 font-semibold text-[#1F5C4A]">{item.job}</p><p className="mt-1 text-sm text-[#255849]">{item.line} - {item.assignee}</p></div>
                  <StatusBadge value={item.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <ThemeCard className="bg-[#FFFFFF]">
            <p className="text-sm font-semibold">Work Orders List</p>
            <div className="mt-4 space-y-3">
              {productionSchedule.slice(0, 3).map((item) => <div key={item.job} className="rounded-2xl border border-inherit px-4 py-3 text-sm">{item.job}</div>)}
            </div>
          </ThemeCard>
          <ThemeCard className="bg-[#FFFFFF]">
            <p className="text-sm font-semibold">Drag & Drop Scheduling</p>
            <div className="mt-4 rounded-[18px] border border-dashed border-[#E5D8C7] p-6 text-center text-[#255849]">Schedule lanes are ready for drag-and-drop interaction styling.</div>
          </ThemeCard>
        </div>
      </div>
    </ThemeCard>
  );
}

export function ManufacturingPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Manufacturing" description="Step-by-step production stages with progress indicators, worker assignment, and status tracking." />
      <div className="grid gap-4 md:grid-cols-3">
        {manufacturingSteps.map((step) => (
          <ThemeCard key={step.name} className="bg-[#FFFFFF]">
            <div className="flex items-center justify-between"><p className="font-semibold">{step.name}</p><StatusBadge value={step.status} /></div>
            <div className="mt-4 h-2 rounded-full bg-[#EFE7DA]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${step.progress}%` }} /></div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#255849]"><span>{step.progress}% complete</span><span>{step.workers} workers</span></div>
          </ThemeCard>
        ))}
      </div>
    </ThemeCard>
  );
}

export function MachinesPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Machines" description="Mobile machine health, utilization, and upcoming service windows." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {machineCards.map((machine) => (
          <ThemeCard key={machine.name} className="bg-[#FFFFFF]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{machine.name}</p>
                <p className="mt-1 text-sm text-[#255849]">Next service: {machine.nextService}</p>
              </div>
              <StatusBadge value={machine.status} />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm font-semibold text-[#255849]">
                <span>Utilization</span>
                <span>{machine.utilization}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#EFE7DA]">
                <div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: machine.utilization }} />
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>
    </ThemeCard>
  );
}

export function InventoryPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [addPanel, setAddPanel] = useState('');
  const [manualForm, setManualForm] = useState({ name: '', sku: '', category: 'Finished Goods', quantity: '', location: '', status: 'Healthy' });
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [inventoryItems, setInventoryItems] = useState([
    { name: 'Eco Bottle Batch 42', sku: 'FG-EB-042', category: 'Finished Goods', quantity: '18,400 units', location: 'WH-01 Bengaluru', status: 'Healthy', source: 'ERP Sync', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Biopolymer Pellets', sku: 'RM-BP-118', category: 'Raw Materials', quantity: '640 kg', location: 'WH-02 Hyderabad', status: 'Low', source: 'Safety stock', image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Tote Assembly Lot 18', sku: 'WIP-TA-018', category: 'WIP', quantity: '2,160 units', location: 'Line C', status: 'Running', source: 'Production line', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Natural Dye Compound', sku: 'RM-ND-204', category: 'Raw Materials', quantity: '1,120 L', location: 'WH-01 Bengaluru', status: 'Healthy', source: 'Manual audit', image: 'https://images.unsplash.com/photo-1606913084603-3e7702b01627?auto=format&fit=crop&w=800&q=80' },
    { name: 'Retail Pack NH-28', sku: 'FG-RP-028', category: 'Finished Goods', quantity: '7,820 units', location: 'WH-03 Pune', status: 'Ready', source: 'QA cleared', image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=800&q=80' },
    { name: 'Labeling Cycle 11', sku: 'WIP-LC-011', category: 'WIP', quantity: '4,300 units', location: 'Line B', status: 'Inspection', source: 'Shift Alpha', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80' },
  ]);

  const categoryTabs = ['All', 'Raw Materials', 'WIP', 'Finished Goods'];
  const visibleItems = inventoryItems.filter((item) => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = [item.name, item.sku, item.location, item.status].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const statusTone = {
    Healthy: 'Approved',
    Ready: 'Ready',
    Running: 'Running',
    Inspection: 'Inspection',
    Low: 'Low',
    Critical: 'Critical',
  };

  const addManualProduct = (event) => {
    event.preventDefault();
    if (!manualForm.name.trim() || !manualForm.quantity.trim()) return;

    setInventoryItems((prev) => [
      {
        ...manualForm,
        sku: manualForm.sku.trim() || `INV-${String(prev.length + 1).padStart(3, '0')}`,
        source: 'Manual entry',
        image: manufacturerImageFallbacks[manualForm.category],
      },
      ...prev,
    ]);
    setManualForm({ name: '', sku: '', category: 'Finished Goods', quantity: '', location: '', status: 'Healthy' });
    setImportMessage('Product added manually to inventory.');
  };

  const importExcelSheet = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importedRows = [
      { name: 'Imported Product Alpha', sku: 'XLS-001', category: 'Finished Goods', quantity: '1,250 units', location: 'WH-01 Bengaluru', status: 'Healthy', source: file.name, image: manufacturerImageFallbacks['Finished Goods'] },
      { name: 'Imported Material Beta', sku: 'XLS-002', category: 'Raw Materials', quantity: '920 kg', location: 'WH-02 Hyderabad', status: 'Low', source: file.name, image: manufacturerImageFallbacks['Raw Materials'] },
    ];

    setInventoryItems((prev) => [...importedRows, ...prev]);
    setImportMessage(`${file.name} uploaded. Preview rows were generated for the frontend demo.`);
    event.target.value = '';
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceText('Eco jars 500 units WH-01, Cotton rolls 240 kg WH-02, Packaging lids 900 units WH-03');
      setImportMessage('Voice recognition is not supported in this browser, so a sample voice list was generated.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setImportMessage('Voice capture stopped. Try again or enter the list manually.');
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ');
      setVoiceText(transcript);
      setImportMessage('Voice list captured. Review it and generate inventory rows.');
    };
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setImportMessage('Voice capture could not start. You can type the inventory list manually.');
    }
  };

  const generateFromVoice = () => {
    const rows = voiceText
      .split(/,|\n/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry, index) => ({
        name: entry.replace(/\s+\d+.*/, '').trim() || `Voice Product ${index + 1}`,
        sku: `VOICE-${String(inventoryItems.length + index + 1).padStart(3, '0')}`,
        category: index % 2 === 0 ? 'Finished Goods' : 'Raw Materials',
        quantity: entry.match(/\d+[\w\s]*/)?.[0]?.trim() || '1 unit',
        location: entry.match(/WH-\d+/i)?.[0]?.toUpperCase() || 'Pending location',
        status: 'Ready',
        source: 'Voice capture',
        image: manufacturerImageFallbacks[index % 2 === 0 ? 'Finished Goods' : 'Raw Materials'],
      }));

    if (!rows.length) return;
    setInventoryItems((prev) => [...rows, ...prev]);
    setVoiceText('');
    setImportMessage(`${rows.length} inventory row${rows.length > 1 ? 's' : ''} generated from voice.`);
  };

  const handleWizardMethodSelect = (methodId) => {
    setShowWizardModal(false);
    setAddPanel('');
    setImportMessage(`${methodId === 'excel' ? 'Spreadsheet' : methodId === 'voice' ? 'Voice' : 'Manual'} stock workflow completed.`);
  };

  const handleWizardRowsCreate = (rows, methodId) => {
    setInventoryItems((prev) => [...rows, ...prev]);
    setImportMessage(`${rows.length} inventory row${rows.length > 1 ? 's' : ''} created from ${methodId === 'excel' ? 'spreadsheet upload' : methodId === 'voice' ? 'voice input' : 'manual entry'}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1F5C4A]">Inventory</h1>
          <p className="mt-1 text-sm text-[#255849]">Manage your stock seamlessly</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowWizardModal(true)} className="rounded-xl bg-[#1F5C4A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#255849]">➕ Add Inventory</button>
          <div className="flex rounded-xl border border-[#E6ECEA] bg-white p-1">
            {['grid', 'list'].map((mode) => (
              <button key={mode} type="button" title={`${mode} view`} aria-label={`${mode} view`} onClick={() => setViewMode(mode)} className={cn('grid h-9 w-9 place-items-center rounded-lg transition', viewMode === mode ? 'bg-[#1F5C4A] text-white' : 'text-[#255849] hover:bg-[#E6ECEA]')}>
                <MobileGlyph name={mode} className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {inventoryBuckets.map((item) => (
          <div key={item.label} className="rounded-[14px] border border-[#E6ECEA] bg-white p-4 shadow-[0_10px_24px_rgba(37,88,73,0.04)]">
            <p className="text-sm font-medium text-[#777]">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-[#1a1a1a]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="hidden flex-wrap items-center gap-5 rounded-[14px] border border-[#E6ECEA] bg-white px-4 py-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#1F5C4A] transition hover:text-[#255849]">
          <input type="file" accept=".xlsx,.xls,.csv" onChange={importExcelSheet} className="sr-only" />
          <span aria-hidden="true">📄</span>
          <span>Upload Excel</span>
        </label>
        <button type="button" onClick={() => setAddPanel(addPanel === 'manual' ? '' : 'manual')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F5C4A] transition hover:text-[#255849]">
          <span aria-hidden="true">✍</span>
          <span>Manual Entry</span>
        </button>
        <button type="button" onClick={() => { setAddPanel('voice'); startVoiceCapture(); }} className="inline-flex items-center gap-3 text-sm font-semibold text-[#1F5C4A] transition hover:text-[#255849]">
          <span className={cn('relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(31,92,74,0.24)] transition', isListening ? 'bg-[#255849]' : 'bg-[#1F5C4A]')}>
            {isListening ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1F5C4A]/40" /> : null}
            <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
              <path d="M19 11a7 7 0 0 1-14 0" />
              <path d="M12 18v3" />
              <path d="M8 21h8" />
            </svg>
          </span>
          <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
        </button>
      </div>

      {importMessage ? <div className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-3 text-sm font-medium text-[#1F5C4A]">{importMessage}</div> : null}

      {addPanel === 'manual' ? (
        <form onSubmit={addManualProduct} className="grid gap-3 rounded-[14px] border border-[#E6ECEA] bg-white p-4 md:grid-cols-3">
          <input value={manualForm.name} onChange={(e) => setManualForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A]" />
          <input value={manualForm.quantity} onChange={(e) => setManualForm((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="Quantity" className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A]" />
          <input value={manualForm.location} onChange={(e) => setManualForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A]" />
          <select value={manualForm.category} onChange={(e) => setManualForm((prev) => ({ ...prev, category: e.target.value }))} className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A]">
            <option>Raw Materials</option>
            <option>WIP</option>
            <option>Finished Goods</option>
          </select>
          <input value={manualForm.sku} onChange={(e) => setManualForm((prev) => ({ ...prev, sku: e.target.value }))} placeholder="SKU optional" className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A]" />
          <button type="submit" className="rounded-xl bg-[#1F5C4A] px-4 py-2.5 text-sm font-semibold text-white">Create item</button>
        </form>
      ) : null}

      {addPanel === 'voice' ? (
        <div className="rounded-[14px] border border-[#E6ECEA] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#777]">Speak or edit a comma-separated inventory list.</p>
            <button type="button" onClick={generateFromVoice} className="rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-2 text-sm font-semibold text-[#1F5C4A]">Generate Rows</button>
          </div>
          <textarea value={voiceText} onChange={(e) => setVoiceText(e.target.value)} rows={3} placeholder="Eco jars 500 units WH-01, Cotton rolls 240 kg WH-02" className="mt-3 w-full rounded-xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-3 text-sm outline-none focus:border-[#1F5C4A]" />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition', activeTab === tab ? 'border-[#1F5C4A] bg-[#1F5C4A] text-white' : 'border-[#E6ECEA] bg-white text-[#1F5C4A] hover:border-[#1F5C4A]')}>
              {tab === 'Raw Materials' ? 'Raw' : tab === 'Finished Goods' ? 'Finished' : tab}
            </button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-[#E6ECEA] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1F5C4A] lg:w-72" />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <motion.div key={`${item.sku}-${item.name}`} whileHover={{ y: -3 }} className="overflow-hidden rounded-[14px] border border-[#E6ECEA] bg-white shadow-[0_12px_28px_rgba(37,88,73,0.05)]">
              <div className="aspect-[16/9] overflow-hidden bg-[#E6ECEA]">
                <img src={item.image || manufacturerImageFallbacks[item.category]} alt={item.name} className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-[#1a1a1a]">{item.name}</h4>
                  <p className="mt-1 text-sm text-[#777]">{item.sku}</p>
                </div>
                <StatusBadge value={statusTone[item.status] || item.status} />
                </div>
                <div className="mt-4 space-y-1 text-sm text-[#777]">
                  <p>Qty: <span className="font-semibold text-[#1F5C4A]">{item.quantity}</span></p>
                  <p>{item.location}</p>
                  <p>{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[#E6ECEA] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E6ECEA] text-[#777]">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={`${item.sku}-${item.name}`} className="border-b border-[#E6ECEA] last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img src={item.image || manufacturerImageFallbacks[item.category]} alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                      <div><p className="font-semibold text-[#1a1a1a]">{item.name}</p><p className="mt-0.5 text-xs text-[#777]">{item.sku}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#777]">{item.quantity}</td>
                  <td className="px-4 py-3 text-[#777]">{item.location}</td>
                  <td className="px-4 py-3"><StatusBadge value={statusTone[item.status] || item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Stock Wizard Modal */}
      <AddStockWizard
        open={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onMethodSelect={handleWizardMethodSelect}
        onCreateRows={handleWizardRowsCreate}
        type="manufacturer"
        customTitle="Add New Inventory"
        customSubtitle="Choose how you want to create stock entries"
      />
    </div>
  );
}

export function QualityControlPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Quality Control" description="Inspection reports, defect tracking, pass/fail indicators, and upload options." action={<ActionButton>Upload Reports</ActionButton>} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[18px] border border-inherit">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EFEAE1]">
              <tr className="text-[#255849]">
                <th className="px-4 py-3 font-medium">Inspection Reports</th>
                <th className="px-4 py-3 font-medium">Pass / Fail</th>
                <th className="px-4 py-3 font-medium">Defect List</th>
                <th className="px-4 py-3 font-medium">Inspector</th>
              </tr>
            </thead>
            <tbody>
              {qualityReports.map((row) => (
                <tr key={row.batch} className="border-t border-[#E5D8C7]">
                  <td className="px-4 py-3 font-medium">{row.batch}</td>
                  <td className="px-4 py-3"><StatusBadge value={row.result} /></td>
                  <td className="px-4 py-3">{row.defects}</td>
                  <td className="px-4 py-3">{row.inspector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ThemeCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Upload Reports</p>
          <div className="mt-4 rounded-[18px] border border-dashed border-[#E5D8C7] p-6 text-center text-[#255849]">Drop inspection files here or browse to upload quality documentation.</div>
        </ThemeCard>
      </div>
    </ThemeCard>
  );
}

export function SupplyChainPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Supply Chain" description="Vendor management, shipment tracking, and delivery timeline visualization." />
      <div className="space-y-4">
        {supplyChainItems.map((item) => (
          <div key={item.vendor} className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold">{item.vendor}</p><p className="mt-1 text-sm text-[#255849]">{item.route}</p></div>
              <StatusBadge value={item.eta} />
            </div>
            <div className="mt-4 h-2 rounded-full bg-[#EFE7DA]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.progress}%` }} /></div>
          </div>
        ))}
      </div>
    </ThemeCard>
  );
}

export function OrdersPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Orders" description="Bulk retailer orders, status tracking, and approval actions." action={<ActionButton>Approve Orders</ActionButton>} />
      <div className="mb-4 flex gap-2"><ActionButton>Approve</ActionButton><ActionButton>Reject</ActionButton></div>
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#EFEAE1]">
            <tr className="text-[#255849]">
              <th className="px-4 py-3 font-medium">Retailer</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Status Flow</th>
            </tr>
          </thead>
          <tbody>
            {quotationOrders.map((row) => (
              <tr key={row.id} className="border-t border-[#E5D8C7]">
                <td className="px-4 py-3 font-medium">{row.retailer}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3"><StatusBadge value={row.stage} /></td>
                <td className="px-4 py-3 text-sm text-[#255849]">Requested - Approved - Shipped - Delivered</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ThemeCard>
  );
}

export function WarehousesPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Warehouses" description="Multiple warehouses, stock distribution, and optional map view." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-5">
          <div className="grid min-h-[220px] place-items-center rounded-[18px] border border-dashed border-inherit text-center">
            <div><p className="text-sm font-medium">Map View</p><p className="mt-2 text-sm text-[#255849]">Ready for map integration across warehouse clusters.</p></div>
          </div>
        </div>
        <div className="space-y-4">
          {warehouses.map((item) => (
            <div key={item.name} className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
              <div className="flex items-center justify-between"><p className="font-semibold">{item.name}</p><span className="text-[#255849]">{item.temperature}</span></div>
              <div className="mt-4 h-2 rounded-full bg-[#EFE7DA]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div>
              <div className="mt-3 flex items-center justify-between text-sm"><span className="text-[#255849]">Stock per warehouse {item.fill}%</span><span className="text-[#255849]">{item.skus} active SKUs</span></div>
            </div>
          ))}
        </div>
      </div>
    </ThemeCard>
  );
}

export function ReportsAnalyticsPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Reports & Analytics" description="Charts for production efficiency, cost analysis, and waste tracking with export options." action={<ActionButton>Export Reports</ActionButton>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {reportCards.map((item) => <ThemeCard key={item.title} className="bg-[#FFFFFF]"><p className="text-sm font-medium">{item.title}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className="mt-2 text-sm text-[#255849]">{item.note}</p></ThemeCard>)}
        </div>
        <div className="space-y-4">
          <ThemeCard className="bg-[#FFFFFF]">
            <p className="font-semibold">Loading State</p>
            <div className="mt-4 space-y-3"><SkeletonBlock className="h-10 w-2/3" /><SkeletonBlock className="h-20 w-full" /><SkeletonBlock className="h-20 w-full" /></div>
          </ThemeCard>
          <ThemeCard className="bg-[#FFFFFF]">
            <p className="font-semibold">Success / Error States</p>
            <div className="mt-4 rounded-2xl border border-[#E5D8C7] bg-[#EFEAE1] px-4 py-4 text-sm text-[#1F5C4A]">Monthly efficiency report exported successfully and shared with leadership.</div>
            <div className="mt-3 rounded-2xl border border-[#E5D8C7] bg-[#EFE7DA] px-4 py-4 text-sm text-[#255849]">Data sync interrupted for waste analysis. Retry once source systems are back online.</div>
          </ThemeCard>
        </div>
      </div>
    </ThemeCard>
  );
}

export function ManufacturerSettingsPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Settings" description="Localization, export defaults, and dashboard preferences." />
      <div className="grid gap-4 md:grid-cols-2">
        <ThemeCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Language</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Current locale</span><span className="text-sm font-medium text-[#1F5C4A]">EN / HI / TE</span></div>
        </ThemeCard>
        <ThemeCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Exports</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Default format</span><span className="text-sm font-medium text-[#1F5C4A]">CSV + PDF</span></div>
        </ThemeCard>
      </div>
    </ThemeCard>
  );
}
