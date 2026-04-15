import React from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  inventoryBuckets,
  machineCards,
  manufacturerAlerts,
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
} from '../../data/manufacturerDashboardData';
import { ActionButton, cn, MiniStat, SectionHeader, SkeletonBlock, StatusBadge, ThemeCard, TooltipChip } from './ManufacturerUI';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const stateToBadge = { info: 'Running', warning: 'Low', danger: 'Critical', success: 'Approved' };

const chartBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#475c54', boxWidth: 12, boxHeight: 12 } } },
  scales: {
    x: { ticks: { color: '#71837c' }, grid: { color: 'rgba(31,92,74,0.06)' } },
    y: { ticks: { color: '#71837c' }, grid: { color: 'rgba(31,92,74,0.06)' } },
  },
};

const productionTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ label: 'Production', data: [12400, 13850, 13200, 14900, 16220, 15840, 18420], borderColor: '#1F5C4A', backgroundColor: 'rgba(31,92,74,0.15)', fill: true, tension: 0.35, pointRadius: 0 }],
};

const ordersVsDeliveriesData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{ label: 'Orders', data: [42, 55, 61, 72], backgroundColor: '#1F5C4A', borderRadius: 10 }, { label: 'Deliveries', data: [38, 49, 57, 68], backgroundColor: '#D7C7AD', borderRadius: 10 }],
};

const inventoryDistributionData = {
  labels: ['Raw Materials', 'WIP', 'Finished'],
  datasets: [{ data: [41, 23, 36], backgroundColor: ['#1F5C4A', '#6FA695', '#D7C7AD'], borderWidth: 0 }],
};

export function ManufacturerDashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#778981]">Manufacturer Operations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#17342a] sm:text-4xl">Enterprise control for production, warehousing, and supply chain velocity.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d7168] sm:text-base">A premium operating layer for monitoring plant output, inventory risk, order flow, and logistics across the Nasuo Hive network.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ActionButton>Add Product</ActionButton>
          <ActionButton>Create Work Order</ActionButton>
          <ActionButton>Update Stock</ActionButton>
          <ActionButton>Approve Orders</ActionButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {manufacturerStats.map((item) => <MiniStat key={item.label} item={item} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ThemeCard>
          <SectionHeader title="Production Trend" description="Weekly output trend across active manufacturing lines." />
          <div className="h-[280px]"><Line data={productionTrendData} options={chartBase} /></div>
        </ThemeCard>
        <ThemeCard>
          <SectionHeader title="Orders vs Delivery" description="Retailer demand versus completed deliveries." />
          <div className="h-[280px]"><Bar data={ordersVsDeliveriesData} options={chartBase} /></div>
        </ThemeCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.05fr_0.9fr]">
        <ThemeCard>
          <SectionHeader title="Inventory Distribution" description="Capital concentration across inventory stages." />
          <div className="mx-auto h-[240px] max-w-[260px]"><Doughnut data={inventoryDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#475c54' } } } }} /></div>
        </ThemeCard>
        <ThemeCard>
          <SectionHeader title="Recent Activity Feed" description="Live operational events from orders, shipments, and stock alerts." />
          <div className="space-y-3">
            {manufacturerRecentActivity.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#e8decf] bg-[#fcfaf6] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-medium">{item.title}</p><p className="mt-1 text-sm text-[#5d7168]">{item.meta}</p></div>
                  <StatusBadge value={stateToBadge[item.state]} />
                </div>
              </div>
            ))}
          </div>
        </ThemeCard>
        <ThemeCard>
          <SectionHeader title="Smart Alerts" description="AI-informed risk flags surfaced before SLA impact." />
          <div className="space-y-3">
            {manufacturerAlerts.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#e8decf] bg-[#fcfaf6] p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-medium">{item.label}</p><StatusBadge value={item.label} /></div>
                <p className="mt-2 text-sm text-[#5d7168]">{item.detail}</p>
              </div>
            ))}
          </div>
        </ThemeCard>
      </div>
    </div>
  );
}

export function RawMaterialsPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Raw Materials" description="Searchable table showing material name, supplier, quantity, and quality status." action={<TooltipChip label="Supplier risk" tip="Computed from lead time volatility, quality holds, and fulfillment history." />} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input placeholder="Search materials or suppliers" className="w-full rounded-2xl border border-[#e3d7c6] bg-[#fcfaf6] px-4 py-3 text-sm text-[#17342a] outline-none" />
        <div className="flex gap-2"><ActionButton>Add Material</ActionButton><ActionButton>Edit</ActionButton><ActionButton>Delete</ActionButton></div>
      </div>
      <div className="mb-4 flex gap-2"><ActionButton>Supplier</ActionButton><ActionButton>Status</ActionButton></div>
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <div className="max-h-[300px] overflow-auto bg-[#fcfaf6]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#f6efe6]">
              <tr className="text-[#567067]">
                <th className="px-4 py-3 font-medium">Material Name</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Quality Status</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((row, index) => (
                <tr key={row.name} className="border-t border-[#ede4d7]">
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
        <div className="rounded-[18px] border border-[#e7ddcf] bg-[#fcfaf6] p-4">
          <div className="mb-4 flex items-center justify-between"><p className="font-medium">Calendar View</p><StatusBadge value="Running" /></div>
          <div className="space-y-3">
            {productionSchedule.map((item) => (
              <motion.div key={item.time} whileHover={{ y: -2 }} className="rounded-2xl border border-[#ede3d6] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs uppercase tracking-[0.24em] text-[#7d9389]">{item.time}</p><p className="mt-1 font-semibold">{item.job}</p><p className="mt-1 text-sm text-[#6a7f76]">{item.line} · {item.assignee}</p></div>
                  <StatusBadge value={item.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <ThemeCard className="bg-[#fcfaf6]">
            <p className="text-sm font-semibold">Work Orders List</p>
            <div className="mt-4 space-y-3">
              {productionSchedule.slice(0, 3).map((item) => <div key={item.job} className="rounded-2xl border border-inherit px-4 py-3 text-sm">{item.job}</div>)}
            </div>
          </ThemeCard>
          <ThemeCard className="bg-[#fcfaf6]">
            <p className="text-sm font-semibold">Drag & Drop Scheduling</p>
            <div className="mt-4 rounded-[18px] border border-dashed border-[#dacdbd] p-6 text-center text-[#70817b]">Schedule lanes are ready for drag-and-drop interaction styling.</div>
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
          <ThemeCard key={step.name} className="bg-[#fcfaf6]">
            <div className="flex items-center justify-between"><p className="font-semibold">{step.name}</p><StatusBadge value={step.status} /></div>
            <div className="mt-4 h-2 rounded-full bg-[#ebe3d7]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${step.progress}%` }} /></div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#5d7168]"><span>{step.progress}% complete</span><span>{step.workers} workers</span></div>
          </ThemeCard>
        ))}
      </div>
    </ThemeCard>
  );
}

export function InventoryPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Inventory" description="Tabs for raw materials, work-in-progress, and finished goods with low-stock alerts." />
      <div className="mb-4 flex gap-2"><ActionButton>Raw Materials</ActionButton><ActionButton>WIP</ActionButton><ActionButton>Finished Goods</ActionButton></div>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {inventoryBuckets.map((item) => <ThemeCard key={item.label} className="bg-[#fcfaf6]"><p className="text-sm font-medium">{item.label}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className="mt-1 text-sm text-[#70817a]">{item.amount}</p></ThemeCard>)}
        </div>
        <ThemeCard className="bg-[#fcfaf6]">
          <p className="font-semibold">Low Stock Warning</p>
          <div className="mt-4 space-y-3">
            {manufacturerAlerts.map((alert) => (
              <div key={alert.label} className="rounded-2xl border border-[#ede2d4] bg-white p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-medium">{alert.label}</p><StatusBadge value={alert.label} /></div>
                <p className="mt-2 text-sm text-[#6a7d76]">{alert.detail}</p>
              </div>
            ))}
          </div>
        </ThemeCard>
      </div>
    </ThemeCard>
  );
}

export function QualityControlPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Quality Control" description="Inspection reports, defect tracking, pass/fail indicators, and upload options." action={<ActionButton>Upload Reports</ActionButton>} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[18px] border border-inherit">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6efe6]">
              <tr className="text-[#567067]">
                <th className="px-4 py-3 font-medium">Inspection Reports</th>
                <th className="px-4 py-3 font-medium">Pass / Fail</th>
                <th className="px-4 py-3 font-medium">Defect List</th>
                <th className="px-4 py-3 font-medium">Inspector</th>
              </tr>
            </thead>
            <tbody>
              {qualityReports.map((row) => (
                <tr key={row.batch} className="border-t border-[#eee3d6]">
                  <td className="px-4 py-3 font-medium">{row.batch}</td>
                  <td className="px-4 py-3"><StatusBadge value={row.result} /></td>
                  <td className="px-4 py-3">{row.defects}</td>
                  <td className="px-4 py-3">{row.inspector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ThemeCard className="bg-[#fcfaf6]">
          <p className="font-semibold">Upload Reports</p>
          <div className="mt-4 rounded-[18px] border border-dashed border-[#dacdbd] p-6 text-center text-[#70817b]">Drop inspection files here or browse to upload quality documentation.</div>
        </ThemeCard>
      </div>
    </ThemeCard>
  );
}

export function MachinesPage() {
  return (
    <ThemeCard>
      <SectionHeader title="Machines" description="Machine status, performance metrics, and maintenance schedules using cards." />
      <div className="grid gap-4 md:grid-cols-3">
        {machineCards.map((machine) => (
          <motion.div key={machine.name} whileHover={{ y: -2 }} className="rounded-[18px] border border-[#e7ddcf] bg-[#fcfaf6] p-4">
            <div className="flex items-center justify-between"><p className="font-semibold">{machine.name}</p><StatusBadge value={machine.status} /></div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#5d7168]">Performance</span><span>{machine.utilization}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#5d7168]">Maintenance Schedule</span><span>{machine.nextService}</span></div>
            </div>
          </motion.div>
        ))}
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
          <div key={item.vendor} className="rounded-[18px] border border-[#e7ddcf] bg-[#fcfaf6] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold">{item.vendor}</p><p className="mt-1 text-sm text-[#6a7d76]">{item.route}</p></div>
              <StatusBadge value={item.eta} />
            </div>
            <div className="mt-4 h-2 rounded-full bg-[#ece3d7]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.progress}%` }} /></div>
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
          <thead className="bg-[#f6efe6]">
            <tr className="text-[#567067]">
              <th className="px-4 py-3 font-medium">Retailer</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Status Flow</th>
            </tr>
          </thead>
          <tbody>
            {quotationOrders.map((row) => (
              <tr key={row.id} className="border-t border-[#eee3d6]">
                <td className="px-4 py-3 font-medium">{row.retailer}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3"><StatusBadge value={row.stage} /></td>
                <td className="px-4 py-3 text-sm text-[#6a7d76]">Requested → Approved → Shipped → Delivered</td>
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
        <div className="rounded-[18px] border border-[#e7ddcf] bg-[#fcfaf6] p-5">
          <div className="grid min-h-[220px] place-items-center rounded-[18px] border border-dashed border-inherit text-center">
            <div><p className="text-sm font-medium">Map View</p><p className="mt-2 text-sm text-[#6d8077]">Ready for map integration across warehouse clusters.</p></div>
          </div>
        </div>
        <div className="space-y-4">
          {warehouses.map((item) => (
            <div key={item.name} className="rounded-[18px] border border-[#e7ddcf] bg-[#fcfaf6] p-4">
              <div className="flex items-center justify-between"><p className="font-semibold">{item.name}</p><span className="text-[#5d7168]">{item.temperature}</span></div>
              <div className="mt-4 h-2 rounded-full bg-[#ece3d7]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div>
              <div className="mt-3 flex items-center justify-between text-sm"><span className="text-[#5d7168]">Stock per warehouse {item.fill}%</span><span className="text-[#5d7168]">{item.skus} active SKUs</span></div>
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
          {reportCards.map((item) => <ThemeCard key={item.title} className="bg-[#fcfaf6]"><p className="text-sm font-medium">{item.title}</p><p className="mt-2 text-2xl font-semibold">{item.value}</p><p className="mt-2 text-sm text-[#70817b]">{item.note}</p></ThemeCard>)}
        </div>
        <div className="space-y-4">
          <ThemeCard className="bg-[#fcfaf6]">
            <p className="font-semibold">Loading State</p>
            <div className="mt-4 space-y-3"><SkeletonBlock className="h-10 w-2/3" /><SkeletonBlock className="h-20 w-full" /><SkeletonBlock className="h-20 w-full" /></div>
          </ThemeCard>
          <ThemeCard className="bg-[#fcfaf6]">
            <p className="font-semibold">Success / Error States</p>
            <div className="mt-4 rounded-2xl border border-[#cce1d4] bg-[#eef8f1] px-4 py-4 text-sm text-[#2d6a50]">Monthly efficiency report exported successfully and shared with leadership.</div>
            <div className="mt-3 rounded-2xl border border-[#e7c3b8] bg-[#fff3f0] px-4 py-4 text-sm text-[#9b5646]">Data sync interrupted for waste analysis. Retry once source systems are back online.</div>
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
        <ThemeCard className="bg-[#fcfaf6]">
          <p className="font-semibold">Language</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Current locale</span><span className="text-sm font-medium text-[#35584b]">EN / HI / TE</span></div>
        </ThemeCard>
        <ThemeCard className="bg-[#fcfaf6]">
          <p className="font-semibold">Exports</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3"><span>Default format</span><span className="text-sm font-medium text-[#35584b]">CSV + PDF</span></div>
        </ThemeCard>
      </div>
    </ThemeCard>
  );
}
