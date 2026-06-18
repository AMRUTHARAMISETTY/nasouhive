import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  posPayments,
  priceComparisons,
  manufacturerInventory,
  retailerAlerts,
  retailerCustomers,
  retailerInventory,
  retailerOffers,
  retailerOrders,
  retailerPayments,
  retailerProducts,
  retailerRecentActivity,
  retailerReports,
  retailerStats,
  retailerSuppliers,
} from '../../data/retailerPortalData';
import { cn, ComparisonCard, RetailerAction, RetailerBadge, RetailerCard, RetailerSectionHeader, RetailerSkeleton, RetailerStat } from './RetailerUI';
import AddStockWizard from '../AddStockWizard';
import { MobileGlyph } from '../mobile/MobileAppShell';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#255849', boxWidth: 12, boxHeight: 12 } } },
  scales: {
    x: { ticks: { color: '#255849' }, grid: { color: 'rgba(31,92,74,0.12)' } },
    y: { ticks: { color: '#255849' }, grid: { color: 'rgba(31,92,74,0.12)' } },
  },
};

const salesTrend = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ label: 'Sales', data: [8200, 9400, 10100, 11240, 13680, 14820, 16400], borderColor: '#1F5C4A', backgroundColor: 'rgba(31,92,74,0.14)', fill: true, tension: 0.35, pointRadius: 0 }],
};

const topSelling = {
  labels: ['Kettle', 'Desk Lamp', 'Noise Buds', 'Serum'],
  datasets: [{ label: 'Units Sold', data: [420, 312, 288, 260], backgroundColor: ['#1F5C4A', '#255849', '#E5D8C7', '#E6ECEA'], borderRadius: 12 }],
};

const revenueDistribution = {
  labels: ['Groceries', 'Electronics', 'Personal Care', 'Household'],
  datasets: [{ data: [36, 28, 21, 15], backgroundColor: ['#1F5C4A', '#4E8273', '#D3B879', '#B9C8C2'], borderWidth: 0 }],
};

const ordersVsDeliveries = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    { label: 'Orders', data: [42, 56, 51, 68, 74, 82], backgroundColor: '#1F5C4A', borderRadius: 8 },
    { label: 'Delivered', data: [36, 48, 49, 59, 65, 76], backgroundColor: '#D5DED9', borderRadius: 8 },
  ],
};

const retailActions = [
  { label: 'Compare Prices', icon: 'chart', to: '/app/retailer/price-comparison' },
  { label: 'Place Bulk Order', icon: 'orders', to: '/app/retailer/orders' },
  { label: 'Update Inventory', icon: 'box', to: '/app/retailer/inventory' },
  { label: 'Generate Invoice', icon: 'orders', to: '/app/retailer/billing' },
];

const retailInsights = [
  { title: 'Demand Prediction', value: '+12%', text: 'Rice demand is expected to rise next week.', icon: 'chart' },
  { title: 'Supplier Recommendation', value: '-8%', text: 'Switch the sugar supplier to reduce procurement cost.', icon: 'factory' },
  { title: 'Inventory Optimization', value: '3 days', text: 'Reorder detergent before the projected stockout.', icon: 'box' },
  { title: 'Sales Opportunity', value: '+15%', text: 'A festival bundle could increase category sales.', icon: 'spark' },
];

const allFilterValue = 'All';
const defaultRetailerStockImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=640&q=80';
const retailerStockCategories = ['Electronics', 'Home Living', 'Beauty', 'Fashion', 'Kitchen'];
const retailerStockStatuses = ['Healthy', 'Low', 'Active'];

function ProductInventoryGrid({ items, type }) {
  const [inventoryItems, setInventoryItems] = useState(items);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(allFilterValue);
  const [status, setStatus] = useState(allFilterValue);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [stockMessage, setStockMessage] = useState('');
  const [stockForm, setStockForm] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    location: 'Front Store',
    price: '',
    stock: '',
    status: 'Healthy',
    image: '',
  });

  const categories = useMemo(() => [allFilterValue, ...new Set(inventoryItems.map((item) => item.category))], [inventoryItems]);
  const statuses = useMemo(() => [allFilterValue, ...new Set(inventoryItems.map((item) => item.status))], [inventoryItems]);
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inventoryItems.filter((item) => {
      const haystack = [item.sku, item.name, item.category, item.location, item.manufacturer, item.status].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesCategory = category === allFilterValue || item.category === category;
      const matchesStatus = status === allFilterValue || item.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, inventoryItems, search, status]);

  const addRetailerStock = (event) => {
    event.preventDefault();
    if (!stockForm.name.trim() || !stockForm.stock.trim()) return;

    setInventoryItems((prev) => [
      {
        ...stockForm,
        sku: stockForm.sku.trim() || `RT-STK-${String(prev.length + 1).padStart(3, '0')}`,
        price: stockForm.price.trim() || '$0',
        stock: Number(stockForm.stock) || 0,
        fill: Math.min(100, Math.max(8, Number(stockForm.stock) || 24)),
        image: stockForm.image.trim() || defaultRetailerStockImage,
      },
      ...prev,
    ]);
    setStockForm({ name: '', sku: '', category: 'Electronics', location: 'Front Store', price: '', stock: '', status: 'Healthy', image: '' });
    setStockMessage('Stock added to retailer inventory.');
  };

  const importRetailerStock = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importedRows = [
      {
        sku: 'UPL-RT-001',
        name: 'Uploaded Shelf Product',
        category: 'Electronics',
        location: 'Front Store',
        price: '$64',
        stock: 72,
        fill: 72,
        status: 'Healthy',
        image: defaultRetailerStockImage,
      },
      {
        sku: 'UPL-RT-002',
        name: 'Uploaded Reserve Stock',
        category: 'Home Living',
        location: 'Back Warehouse',
        price: '$38',
        stock: 34,
        fill: 34,
        status: 'Low',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=640&q=80',
      },
    ];

    setInventoryItems((prev) => [...importedRows, ...prev]);
    setStockMessage(`${file.name} uploaded. Preview stock rows were added.`);
    event.target.value = '';
  };

  const startVoiceStockCapture = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceText('Smart charger 44 Front Store, Ceramic cups 28 Back Warehouse, Serum pack 36 Front Store');
      setStockMessage('Voice recognition is not supported in this browser, so a sample stock list was added.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setStockMessage('Voice capture stopped. Try again or edit the list manually.');
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ');
      setVoiceText(transcript);
      setStockMessage('Voice stock list captured. Review it and generate rows.');
    };
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setStockMessage('Voice capture could not start. You can type the stock list manually.');
    }
  };

  const generateStockFromVoice = () => {
    const rows = voiceText
      .split(/,|\n/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry, index) => {
        const stock = Number(entry.match(/\d+/)?.[0] || 24);
        return {
          sku: `VOICE-RT-${String(inventoryItems.length + index + 1).padStart(3, '0')}`,
          name: entry.replace(/\s+\d+.*/, '').trim() || `Voice Stock ${index + 1}`,
          category: index % 2 === 0 ? 'Electronics' : 'Home Living',
          location: /warehouse/i.test(entry) ? 'Back Warehouse' : 'Front Store',
          price: '$0',
          stock,
          fill: Math.min(100, Math.max(8, stock)),
          status: stock < 40 ? 'Low' : 'Healthy',
          image: defaultRetailerStockImage,
        };
      });

    if (!rows.length) return;
    setInventoryItems((prev) => [...rows, ...prev]);
    setVoiceText('');
    setStockMessage(`${rows.length} voice stock row${rows.length > 1 ? 's' : ''} added.`);
  };

  const attachStockPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStockForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    setStockMessage(`${file.name} attached as the product image.`);
  };

  const handleWizardMethodSelect = (methodId) => {
    setShowWizardModal(false);
    setStockMessage(`${methodId === 'excel' ? 'Spreadsheet' : methodId === 'voice' ? 'Voice' : 'Manual'} stock workflow completed.`);
  };

  const handleWizardRowsCreate = (rows, methodId) => {
    setInventoryItems((prev) => [...rows, ...prev]);
    setStockMessage(`${rows.length} stock row${rows.length > 1 ? 's' : ''} created from ${methodId === 'excel' ? 'spreadsheet upload' : methodId === 'voice' ? 'voice input' : 'manual entry'}.`);
  };

  return (
    <div className="space-y-4">
      {type === 'retailer' ? (
        <div className="flex flex-col gap-3 rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-[#1F5C4A]">Retailer stock controls</p>
            <p className="mt-1 text-sm text-[#255849]">Add products with stock count, location, price, status, and image.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-[#E6ECEA] bg-white p-1">
              {['grid', 'list'].map((mode) => (
                <button key={mode} type="button" title={`${mode} view`} aria-label={`${mode} view`} onClick={() => setViewMode(mode)} className={cn('grid h-9 w-9 place-items-center rounded-lg transition', viewMode === mode ? 'bg-[#1F5C4A] text-white' : 'text-[#255849] hover:bg-[#E6ECEA]')}>
                  <MobileGlyph name={mode} className="h-4 w-4" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowWizardModal(true)} className="rounded-2xl bg-[#1F5C4A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#255849]">
              ➕ Add Stock
            </button>
          </div>
        </div>
      ) : null}

      {stockMessage && type === 'retailer' ? (
        <div className="rounded-2xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-3 text-sm font-semibold text-[#1F5C4A]">{stockMessage}</div>
      ) : null}

      {/* Legacy add panel removed to keep retailer inventory wizard-only */}

      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, SKU, category, location, or manufacturer"
          className="min-h-12 w-full rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]/60"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none">
          {categories.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none">
          {statuses.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <RetailerCard key={item.sku} className="overflow-hidden bg-[#FFFFFF] p-0">
              <div className="aspect-[4/3] overflow-hidden bg-[#EFEAE1]">
                <img src={item.image || defaultRetailerStockImage} alt={item.name} className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#255849]">{item.sku}</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1F5C4A]">{item.name}</h3>
                  </div>
                  <RetailerBadge value={item.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-[#EFEAE1] p-3">
                    <p className="text-[#255849]">Category</p>
                    <p className="mt-1 font-semibold">{item.category}</p>
                  </div>
                  <div className="rounded-2xl bg-[#EFEAE1] p-3">
                    <p className="text-[#255849]">Stock</p>
                    <p className="mt-1 font-semibold">{item.stock} units</p>
                  </div>
                  <div className="rounded-2xl bg-[#EFEAE1] p-3">
                    <p className="text-[#255849]">{type === 'manufacturer' ? 'Manufacturer' : 'Location'}</p>
                    <p className="mt-1 font-semibold">{type === 'manufacturer' ? item.manufacturer : item.location}</p>
                  </div>
                  <div className="rounded-2xl bg-[#EFEAE1] p-3">
                    <p className="text-[#255849]">{type === 'manufacturer' ? 'Lead Time' : 'Price'}</p>
                    <p className="mt-1 font-semibold">{type === 'manufacturer' ? item.leadTime : item.price}</p>
                  </div>
                </div>
                {type === 'retailer' ? (
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-[#EFEAE1]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div>
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#255849]"><span>Fill {item.fill}%</span><span>{item.location}</span></div>
                  </div>
                ) : (
                  <button className="mt-4 w-full rounded-2xl bg-[#1F5C4A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#255849]">Request Stock</button>
                )}
              </div>
            </RetailerCard>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[#E6ECEA] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E6ECEA] text-[#777]">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={`${item.sku}-${item.name}`} className="border-b border-[#E6ECEA] last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img src={item.image || defaultRetailerStockImage} alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                      <span className="font-semibold text-[#1a1a1a]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#777]">{item.sku}</td>
                  <td className="px-4 py-3 text-[#777]">{item.stock ?? item.fill}</td>
                  <td className="px-4 py-3 text-[#777]">{item.location}</td>
                  <td className="px-4 py-3 text-[#777]">{item.price}</td>
                  <td className="px-4 py-3"><RetailerBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-8 text-center text-sm text-[#255849]">No inventory items match the current filters.</div>
      ) : null}

      {/* Add Stock Wizard Modal */}
      <AddStockWizard
        open={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onMethodSelect={handleWizardMethodSelect}
        onCreateRows={handleWizardRowsCreate}
        type={type}
        customTitle="Add New Inventory"
        customSubtitle="Choose how you want to create stock entries"
      />
    </div>
  );
}

export function RetailerDashboardHome() {
  const navigate = useNavigate();
  const [range, setRange] = useState('7D');

  const lineOptions = {
    ...chartOptions,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1F3B34', padding: 12, cornerRadius: 12, displayColors: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71837D' }, border: { display: false } },
      y: { grid: { color: 'rgba(31,92,74,0.08)' }, ticks: { color: '#71837D' }, border: { display: false } },
    },
  };

  const inventorySummary = [
    { label: 'Available Stock', value: '8,420', progress: 84, tone: 'bg-[#1F5C4A]' },
    { label: 'Low Stock Items', value: '18', progress: 28, tone: 'bg-amber-500' },
    { label: 'Out of Stock', value: '4', progress: 8, tone: 'bg-rose-500' },
    { label: 'Incoming Inventory', value: '1,260', progress: 62, tone: 'bg-sky-500' },
  ];

  const customerMetrics = [
    { label: 'Active Customers', value: '12.8k' },
    { label: 'Repeat Purchases', value: '68%' },
    { label: 'Loyalty Members', value: '4.2k' },
    { label: 'Average Basket', value: 'INR 2,840' },
  ];

  const financeMetrics = [
    { label: 'Revenue', value: 'INR 48.2L' },
    { label: 'Expenses', value: 'INR 31.6L' },
    { label: 'Profit', value: 'INR 11.9L' },
    { label: 'Refunds', value: 'INR 84k' },
    { label: 'GST Summary', value: 'INR 4.7L' },
    { label: 'Invoices', value: '1,248' },
  ];

  return (
    <div className="space-y-5 pb-8">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[24px] bg-[#1F5C4A] px-5 py-7 text-white shadow-[0_28px_70px_rgba(31,92,74,0.22)] sm:px-8 sm:py-9">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] border-l border-white/10 bg-white/[0.035] lg:block" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.46fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E6ECEA]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Retail Operations
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.03] sm:text-4xl xl:text-[48px]">Procure smarter.<br />Sell faster. Grow profitably.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#E6ECEA]/85 sm:text-base">Inventory intelligence, supplier discovery, price optimization and customer growth in one operating layer.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {retailActions.map((action, index) => (
              <motion.button key={action.label} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(action.to)} className={cn('flex min-h-[76px] flex-col items-start justify-between rounded-[16px] border p-3 text-left text-xs font-bold', index === 0 ? 'border-white bg-white text-[#1F5C4A]' : 'border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.13]')}>
                <MobileGlyph name={action.icon} className="h-5 w-5" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {retailerStats.map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4, scale: 1.01 }}>
            <div className="relative min-h-[172px] overflow-hidden rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.09)] backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[72px] bg-[#E6ECEA]/75" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#526A62]">{item.label}</p>
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', item.delta.includes('low') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{item.delta}</span>
                </div>
                <div className="mt-6"><p className="text-3xl font-semibold text-[#1F3B34]">{item.value}</p><p className="mt-2 text-xs text-[#71837D]">{item.detail}</p></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-lg font-semibold text-[#1F3B34]">Sales Trend</p><p className="mt-1 text-sm text-[#71837D]">Daily sales performance across all channels</p></div>
            <div className="flex rounded-xl bg-[#F1F4F2] p-1">{['7D', '30D', '90D'].map((item) => <button key={item} type="button" onClick={() => setRange(item)} className={cn('h-8 rounded-lg px-3 text-xs font-bold', range === item ? 'bg-white text-[#1F5C4A] shadow-sm' : 'text-[#71837D]')}>{item}</button>)}</div>
          </div>
          <div className="mt-3 flex items-end gap-3"><p className="text-3xl font-semibold text-[#1F3B34]">INR 8.4L</p><p className="pb-1 text-xs font-bold text-emerald-600">+15.2% today</p></div>
          <div className="mt-3 h-[300px]"><Line data={salesTrend} options={lineOptions} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
            <p className="text-base font-semibold text-[#1F3B34]">Orders vs Deliveries</p><p className="mt-1 text-xs text-[#71837D]">Manufacturer orders and completed deliveries</p>
            <div className="mt-3 h-[185px]"><Bar data={ordersVsDeliveries} options={{ ...chartOptions, plugins: { legend: { position: 'bottom', labels: { color: '#526A62', usePointStyle: true, boxWidth: 8 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#71837D' } }, y: { display: false } } }} /></div>
          </div>
          <div className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
            <p className="text-base font-semibold text-[#1F3B34]">Revenue Distribution</p><p className="mt-1 text-xs text-[#71837D]">Revenue contribution by category</p>
            <div className="mx-auto mt-2 h-[185px] max-w-[230px]"><Doughnut data={revenueDistribution} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#526A62', usePointStyle: true, boxWidth: 8 } } } }} /></div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[20px] border border-white/75 bg-white/90 shadow-[0_18px_46px_rgba(37,88,73,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#E5ECE8] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div><p className="text-lg font-semibold text-[#1F3B34]">Smart Manufacturer Comparison</p><p className="mt-1 text-sm text-[#71837D]">Compare suppliers instantly and identify the best purchasing option</p></div>
          <button type="button" onClick={() => navigate('/app/retailer/price-comparison')} className="text-xs font-bold text-[#1F5C4A] hover:underline">Open full comparison</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F5F7F6] text-xs uppercase tracking-[0.1em] text-[#71837D]"><tr><th className="px-6 py-4">Manufacturer</th><th className="px-4 py-4">Product</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">MOQ</th><th className="px-4 py-4">Delivery</th><th className="px-4 py-4">Rating</th><th className="px-4 py-4">Signal</th><th className="px-6 py-4" /></tr></thead>
            <tbody>
              {priceComparisons.map((item, index) => (
                <tr key={item.manufacturer} className="border-t border-[#EDF1EF]">
                  <td className="px-6 py-4 font-semibold text-[#1F3B34]">{item.manufacturer}</td><td className="px-4 py-4 text-[#526A62]">Aero Smart Kettle</td><td className="px-4 py-4 font-bold text-[#1F3B34]">{item.price}</td><td className="px-4 py-4 text-[#526A62]">{[40, 30, 50][index]} units</td><td className="px-4 py-4 text-[#526A62]">{item.delivery}</td><td className="px-4 py-4 font-semibold text-[#1F3B34]">{item.rating}</td><td className="px-4 py-4"><RetailerBadge value={item.badge} /></td><td className="px-6 py-4"><button type="button" onClick={() => navigate('/app/retailer/orders')} className="rounded-xl bg-[#1F5C4A] px-3 py-2 text-xs font-bold text-white">Buy Now</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <p className="text-lg font-semibold text-[#1F3B34]">Inventory Snapshot</p><p className="mt-1 text-sm text-[#71837D]">Availability and replenishment health</p>
          <div className="mt-5 space-y-4">{inventorySummary.map((item) => <div key={item.label}><div className="flex items-center justify-between text-sm"><span className="font-semibold text-[#526A62]">{item.label}</span><span className="font-bold text-[#1F3B34]">{item.value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6ECEA]"><motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className={cn('h-full rounded-full', item.tone)} /></div></div>)}</div>
        </section>
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <div className="flex items-end justify-between"><div><p className="text-lg font-semibold text-[#1F3B34]">Live Order Tracking</p><p className="mt-1 text-sm text-[#71837D]">Order RT-4020 from ForgePlus</p></div><RetailerBadge value="Shipped" /></div>
          <div className="mt-8 grid grid-cols-5 gap-1">
            {['Requested', 'Approved', 'Packed', 'Shipped', 'Delivered'].map((step, index) => <div key={step} className="text-center"><div className={cn('mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-bold', index <= 3 ? 'bg-[#1F5C4A] text-white' : 'bg-[#E6ECEA] text-[#71837D]')}>{index + 1}</div><div className={cn('mx-auto mt-2 h-1 w-full rounded-full', index < 3 ? 'bg-[#1F5C4A]' : 'bg-[#E6ECEA]')} /><p className="mt-2 text-[10px] font-bold text-[#526A62] sm:text-xs">{step}</p></div>)}
          </div>
          <div className="mt-6 rounded-[14px] bg-[#F5F7F6] p-4 text-sm text-[#526A62]"><span className="font-bold text-[#1F3B34]">Expected delivery:</span> Tomorrow, 4:30 PM</div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <p className="text-lg font-semibold text-[#1F3B34]">Customer Activity</p><p className="mt-1 text-sm text-[#71837D]">Retention, loyalty and basket performance</p>
          <div className="mt-5 grid grid-cols-2 gap-3">{customerMetrics.map((item) => <div key={item.label} className="rounded-[14px] bg-[#F5F7F6] p-4"><p className="text-xs text-[#71837D]">{item.label}</p><p className="mt-2 text-xl font-semibold text-[#1F3B34]">{item.value}</p></div>)}</div>
        </section>
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <p className="text-lg font-semibold text-[#1F3B34]">Financial Overview</p><p className="mt-1 text-sm text-[#71837D]">Current month financial pulse</p>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">{financeMetrics.map((item) => <div key={item.label} className="border-b border-[#E5ECE8] pb-3"><p className="text-xs text-[#71837D]">{item.label}</p><p className="mt-1 text-base font-semibold text-[#1F3B34]">{item.value}</p></div>)}</div>
        </section>
      </div>

      <section className="rounded-[20px] bg-[#1F3B34] p-5 text-white shadow-[0_24px_60px_rgba(31,59,52,0.2)] sm:p-6">
        <div><p className="text-lg font-semibold">AI Business Insights</p><p className="mt-1 text-sm text-[#C9D7D2]">Recommendations from purchasing, inventory and sales signals</p></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{retailInsights.map((item) => <motion.button key={item.title} whileHover={{ y: -3 }} className="rounded-[16px] border border-white/10 bg-white/[0.07] p-4 text-left hover:bg-white/[0.11]"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><MobileGlyph name={item.icon} className="h-4 w-4" /></span><span className="text-sm font-semibold text-emerald-300">{item.value}</span></div><p className="mt-4 text-sm font-semibold">{item.title}</p><p className="mt-2 text-xs leading-5 text-[#C9D7D2]">{item.text}</p></motion.button>)}</div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <div className="flex items-end justify-between"><div><p className="text-lg font-semibold text-[#1F3B34]">Offers &amp; Promotions</p><p className="mt-1 text-sm text-[#71837D]">Active campaigns and customer benefits</p></div><button type="button" onClick={() => navigate('/app/retailer/offers')} className="text-xs font-bold text-[#1F5C4A]">Create offer</button></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{retailerOffers.map((offer) => <div key={offer.name} className="rounded-[14px] border border-[#E5ECE8] p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-[#1F3B34]">{offer.name}</p><RetailerBadge value={offer.state} /></div><p className="mt-3 text-xs text-[#71837D]">{offer.reach} · {offer.discount} benefit</p></div>)}</div>
        </section>
        <section className="rounded-[20px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_46px_rgba(37,88,73,0.08)] sm:p-6">
          <p className="text-lg font-semibold text-[#1F3B34]">Recent Activity</p><p className="mt-1 text-sm text-[#71837D]">Supplier, order and customer events</p>
          <div className="relative mt-4 space-y-1 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-[#D9E2DE]">{retailerRecentActivity.map((item) => <div key={item.title} className="relative flex gap-4 py-3"><span className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-[4px] border-white bg-[#1F5C4A]" /><div className="flex flex-1 items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[#1F3B34]">{item.title}</p><p className="mt-1 text-xs text-[#71837D]">{item.meta}</p></div><RetailerBadge value={item.status} /></div></div>)}</div>
        </section>
      </div>

      <section>
        <div className="mb-4"><p className="text-lg font-semibold text-[#1F3B34]">Top Manufacturers</p><p className="mt-1 text-sm text-[#71837D]">Preferred suppliers ranked by reliability and competitiveness</p></div>
        <div className="grid gap-4 md:grid-cols-3">{retailerSuppliers.map((supplier, index) => <motion.button key={supplier.name} type="button" onClick={() => navigate('/app/retailer/suppliers')} whileHover={{ y: -4 }} className="rounded-[20px] border border-white/75 bg-white/88 p-5 text-left shadow-[0_18px_46px_rgba(37,88,73,0.08)]"><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#E6ECEA] text-sm font-bold text-[#1F5C4A]">{supplier.name.slice(0, 2).toUpperCase()}</span>{index === 0 ? <RetailerBadge value="Best Deal" /> : null}</div><p className="mt-4 text-base font-semibold text-[#1F3B34]">{supplier.name}</p><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><p className="text-[#71837D]">Rating</p><p className="mt-1 font-bold text-[#1F3B34]">{[4.9, 4.7, 4.6][index]}</p></div><div><p className="text-[#71837D]">Products</p><p className="mt-1 font-bold text-[#1F3B34]">{supplier.products}</p></div><div><p className="text-[#71837D]">Delivery</p><p className="mt-1 font-bold text-[#1F3B34]">{[2, 3, 4][index]} days</p></div></div><div className="mt-4 h-2 rounded-full bg-[#E6ECEA]"><div className="h-full rounded-full bg-[#1F5C4A]" style={{ width: `${[94, 88, 84][index]}%` }} /></div><p className="mt-2 text-xs font-semibold text-[#526A62]">Price competitiveness {[94, 88, 84][index]}%</p></motion.button>)}</div>
      </section>
    </div>
  );
}

export function RetailerProductsPage() {
  const [search, setSearch] = useState('');
  const filteredProducts = useMemo(
    () => retailerProducts.filter((item) => [item.name, item.category, item.sku].join(' ').toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <RetailerCard>
      <RetailerSectionHeader title="Product Management" description="Add, edit, filter, and manage retail-facing product information." />
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories, or SKU" className="w-full rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-3 text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]" />
        <div className="flex gap-2"><RetailerAction>All Categories</RetailerAction><RetailerAction>In Stock</RetailerAction></div>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#EFEAE1]">
              <tr className="text-[#255849]">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((row) => (
                <tr key={row.sku} className="border-t border-[#EFEAE1]">
                  <td className="px-4 py-3 font-medium">{row.sku}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">{row.price}</td>
                  <td className="px-4 py-3">{row.stock}</td>
                  <td className="px-4 py-3"><RetailerBadge value={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RetailerCard>
  );
}

export function RetailerInventoryPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Retailer Inventory" description="Store stock, product images, shelf coverage, and low-stock filters." />
      <ProductInventoryGrid items={retailerInventory} type="retailer" />
    </RetailerCard>
  );
}

export function RetailerStockRequestsPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Stock Requests" description="Touch-first request cards for replenishment and supplier follow-up." />
      <div className="space-y-4">
        {retailerOrders.map((row) => (
          <RetailerCard key={row.id} className="bg-[#FFFFFF]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#255849]">{row.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-[#1F5C4A]">{row.supplier}</h3>
              </div>
              <RetailerBadge value={row.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">Total</p><p className="mt-1 font-semibold">{row.total}</p></div>
              <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">Flow</p><p className="mt-1 font-semibold">Request</p></div>
            </div>
            <button className="mt-4 w-full rounded-2xl bg-[#1F5C4A] px-4 py-3 text-sm font-semibold text-white">View Request</button>
          </RetailerCard>
        ))}
      </div>
    </RetailerCard>
  );
}

export function RetailerStockSignalsPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Smart Stock Signals" description="Mobile AI-style alerts for reorder risk, margin watch, and supplier changes." />
      <div className="space-y-4">
        {retailerAlerts.map((item) => (
          <RetailerCard key={item.label} className="bg-[#FFFFFF]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#1F5C4A]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#255849]">{item.detail}</p>
              </div>
              <RetailerBadge value={item.tone} />
            </div>
            <button className="mt-4 rounded-2xl border border-[#E5D8C7] bg-[#EFEAE1] px-4 py-3 text-sm font-semibold text-[#1F5C4A]">Apply Suggestion</button>
          </RetailerCard>
        ))}
      </div>
    </RetailerCard>
  );
}

export function RetailerWarehousesPage() {
  const locations = ['Front Store', 'Back Warehouse', 'Transit Buffer'];
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Warehouses" description="Location-wise stock coverage and mobile shelf health." />
      <div className="space-y-4">
        {locations.map((location) => {
          const items = retailerInventory.filter((item) => item.location === location);
          const fill = Math.round(items.reduce((sum, item) => sum + item.fill, 0) / Math.max(items.length, 1));
          return (
            <RetailerCard key={location} className="bg-[#FFFFFF]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{location}</p>
                  <p className="mt-1 text-sm text-[#255849]">{items.length} active SKUs</p>
                </div>
                <RetailerBadge value={fill > 55 ? 'Healthy' : 'Low'} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#EFEAE1]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${fill}%` }} /></div>
              <p className="mt-2 text-sm font-semibold text-[#255849]">Shelf coverage {fill}%</p>
            </RetailerCard>
          );
        })}
      </div>
    </RetailerCard>
  );
}

export function ManufacturerInventoryPage() {
  const [marketItems, setMarketItems] = useState(manufacturerInventory);
  const [search, setSearch] = useState('');
  const [productType, setProductType] = useState(allFilterValue);
  const [supplier, setSupplier] = useState(allFilterValue);
  const [sortBy, setSortBy] = useState('Best Match');
  const [marketMessage, setMarketMessage] = useState('');

  const productTypes = useMemo(() => [allFilterValue, ...new Set(marketItems.map((item) => item.productType || item.category))], [marketItems]);
  const suppliers = useMemo(() => [allFilterValue, ...new Set(marketItems.map((item) => item.manufacturer))], [marketItems]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const priceValue = (item) => Number(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    let next = marketItems.filter((item) => {
      const haystack = [item.name, item.sku, item.category, item.productType, item.manufacturer, item.status].join(' ').toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesType = productType === allFilterValue || item.productType === productType;
      const matchesSupplier = supplier === allFilterValue || item.manufacturer === supplier;
      return matchesSearch && matchesType && matchesSupplier;
    });

    if (sortBy === 'Price: Low to High') next = [...next].sort((a, b) => priceValue(a) - priceValue(b));
    if (sortBy === 'Fastest Delivery') next = [...next].sort((a, b) => Number.parseInt(a.leadTime, 10) - Number.parseInt(b.leadTime, 10));
    if (sortBy === 'Highest Rated') next = [...next].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'Stock: High to Low') next = [...next].sort((a, b) => b.stock - a.stock);
    return next;
  }, [marketItems, productType, search, sortBy, supplier]);

  const updateMarketItem = (sku, patch) => {
    setMarketItems((prev) => prev.map((item) => (item.sku === sku ? { ...item, ...patch } : item)));
  };

  const deleteMarketItem = (sku) => {
    setMarketItems((prev) => prev.filter((item) => item.sku !== sku));
    setMarketMessage('Marketplace item deleted.');
  };

  const uploadMarketImage = (sku, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateMarketItem(sku, { image: URL.createObjectURL(file) });
    setMarketMessage(`${file.name} uploaded to marketplace item.`);
    event.target.value = '';
  };

  const saveMarketItem = (item) => {
    setMarketMessage(`${item.name} updated for retailer marketplace search.`);
  };

  const MarketplaceCard = ({ item }) => (
    <RetailerCard className="overflow-hidden bg-[#FFFFFF] p-0">
      <div className="aspect-[4/3] overflow-hidden bg-[#EFEAE1]">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#255849]">{item.productType}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1F5C4A]">{item.name}</h3>
            <p className="mt-1 text-sm text-[#255849]">{item.manufacturer} · {item.sku}</p>
          </div>
          <RetailerBadge value={item.status} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">Wholesale</p><p className="mt-1 font-semibold">{item.price}</p></div>
          <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">Lead Time</p><p className="mt-1 font-semibold">{item.leadTime}</p></div>
          <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">Rating</p><p className="mt-1 font-semibold">{item.rating}</p></div>
          <div className="rounded-2xl bg-[#EFEAE1] p-3"><p className="text-[#255849]">MOQ</p><p className="mt-1 font-semibold">{item.minOrder} units</p></div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="rounded-2xl border border-[#E5D8C7] bg-[#F8FAF9] px-4 py-3 text-sm text-[#1F5C4A]">
            Count
            <input type="number" min="0" value={item.stock} onChange={(event) => updateMarketItem(item.sku, { stock: Number(event.target.value) || 0 })} className="ml-3 w-24 bg-transparent font-semibold outline-none" />
          </label>
          <label className="cursor-pointer rounded-2xl border border-[#E5D8C7] bg-[#F8FAF9] px-4 py-3 text-center text-sm font-semibold text-[#1F5C4A]">
            Image Upload
            <input type="file" accept="image/*" onChange={(event) => uploadMarketImage(item.sku, event)} className="sr-only" />
          </label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => saveMarketItem(item)} className="rounded-2xl bg-[#1F5C4A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#255849]">Update Item</button>
          <button type="button" onClick={() => deleteMarketItem(item.sku)} className="rounded-2xl border border-[#E5D8C7] px-4 py-3 text-sm font-semibold text-[#1F5C4A] transition hover:bg-[#EFEAE1]">Delete</button>
        </div>
      </div>
    </RetailerCard>
  );

  return (
    <RetailerCard>
      <RetailerSectionHeader title="Manufacturer Marketplace" description="Search manufacturer supply, match product types with suppliers, and manage marketplace items for retailer sourcing." />
      <div className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_190px_190px_190px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search manufacturer products, SKUs, suppliers" className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none placeholder:text-[#255849]/60" />
          <select value={productType} onChange={(event) => setProductType(event.target.value)} className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none">
            {productTypes.map((value) => <option key={value} value={value}>{value === allFilterValue ? 'Product Type' : value}</option>)}
          </select>
          <select value={supplier} onChange={(event) => setSupplier(event.target.value)} className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none">
            {suppliers.map((value) => <option key={value} value={value}>{value === allFilterValue ? 'Supplier' : value}</option>)}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-12 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 text-sm text-[#1F5C4A] outline-none">
            {['Best Match', 'Price: Low to High', 'Fastest Delivery', 'Highest Rated', 'Stock: High to Low'].map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-4"><p className="text-sm text-[#255849]">Matched Items</p><p className="mt-1 text-2xl font-semibold">{visibleItems.length}</p></div>
          <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-4"><p className="text-sm text-[#255849]">Suppliers</p><p className="mt-1 text-2xl font-semibold">{suppliers.length - 1}</p></div>
          <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-4"><p className="text-sm text-[#255849]">Product Types</p><p className="mt-1 text-2xl font-semibold">{productTypes.length - 1}</p></div>
          <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] p-4"><p className="text-sm text-[#255849]">Available Count</p><p className="mt-1 text-2xl font-semibold">{visibleItems.reduce((sum, item) => sum + item.stock, 0)}</p></div>
        </div>

        {marketMessage ? <div className="rounded-2xl border border-[#E6ECEA] bg-[#F8FAF9] px-4 py-3 text-sm font-semibold text-[#1F5C4A]">{marketMessage}</div> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => <MarketplaceCard key={item.sku} item={item} />)}
        </div>

        {!visibleItems.length ? <div className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-8 text-center text-sm text-[#255849]">No manufacturer marketplace items match the current product type and supplier filters.</div> : null}
      </div>
    </RetailerCard>
  );
}

export function RetailerSuppliersPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Supplier Management" description="Profiles, purchase history, and payment standing across manufacturers." />
      <div className="grid gap-4 md:grid-cols-3">
        {retailerSuppliers.map((item) => (
          <RetailerCard key={item.name} className="bg-[#FFFFFF]">
            <p className="font-semibold">{item.name}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#255849]">Products</span><span>{item.products}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">Purchase History</span><span>{item.purchaseHistory}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">Payment</span><RetailerBadge value={item.payment} /></div>
            </div>
          </RetailerCard>
        ))}
      </div>
    </RetailerCard>
  );
}

export function RetailerPriceComparisonPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Price Comparison" description="Compare the same product from multiple manufacturers and surface the best option." action={<RetailerAction>Auto-select Best</RetailerAction>} />
      <div className="space-y-4">{priceComparisons.map((item) => <ComparisonCard key={item.manufacturer} item={item} />)}</div>
    </RetailerCard>
  );
}

export function RetailerOrdersPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Order Management" description="Place bulk orders, track lifecycle status, and manage returns or cancellations." />
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#EFEAE1]">
            <tr className="text-[#255849]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Supplier</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {retailerOrders.map((row) => (
              <tr key={row.id} className="border-t border-[#EFEAE1]">
                <td className="px-4 py-3 font-medium">{row.id}</td>
                <td className="px-4 py-3">{row.supplier}</td>
                <td className="px-4 py-3">{row.total}</td>
                <td className="px-4 py-3"><RetailerBadge value={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RetailerCard>
  );
}

export function RetailerBillingPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Billing and POS" description="Invoice generation, GST workflow, barcode scan placeholder, and payment collection." />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <RetailerCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Receipt Preview</p>
          <div className="mt-4 rounded-[18px] border border-dashed border-inherit p-6 text-sm">
            <p>Invoice #POS-2184</p>
            <p className="mt-2">GST included - barcode scanner ready for integration</p>
          </div>
        </RetailerCard>
        <div className="space-y-4">
          <RetailerCard className="bg-[#FFFFFF]">
            <p className="font-semibold">Payment Methods</p>
            <div className="mt-4 space-y-3">
              {posPayments.map((item) => (
                <div key={item.type} className="rounded-[18px] border border-inherit px-4 py-3">
                  <p className="font-medium">{item.type}</p>
                  <p className="mt-1 text-sm text-[#255849]">{item.detail}</p>
                </div>
              ))}
            </div>
          </RetailerCard>
          <RetailerCard className="bg-[#FFFFFF]">
            <p className="font-semibold">GST Breakdown</p>
            <p className="mt-3 text-sm text-[#255849]">Taxable value $6,840 - GST $1,231 - Grand total $8,071</p>
          </RetailerCard>
        </div>
      </div>
    </RetailerCard>
  );
}

export function RetailerCustomersPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Customer Management" description="Profiles, purchase history, loyalty tiers, and discount control." />
      <div className="grid gap-4 md:grid-cols-3">
        {retailerCustomers.map((item) => (
          <RetailerCard key={item.name} className="bg-[#FFFFFF]">
            <p className="font-semibold">{item.name}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#255849]">Lifetime</span><span>{item.lifetime}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">Loyalty</span><RetailerBadge value={item.loyalty === 'Gold' ? 'Approved' : item.loyalty === 'Silver' ? 'Inspection' : 'Draft'} /></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">Discount</span><span>{item.discount}</span></div>
            </div>
          </RetailerCard>
        ))}
      </div>
    </RetailerCard>
  );
}

export function RetailerPaymentsPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Payment Management" description="Transactions, refunds, and settlement reporting." />
      <div className="overflow-hidden rounded-[18px] border border-inherit">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#EFEAE1]">
            <tr className="text-[#255849]">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {retailerPayments.map((row) => (
              <tr key={row.id} className="border-t border-[#EFEAE1]">
                <td className="px-4 py-3 font-medium">{row.id}</td>
                <td className="px-4 py-3">{row.method}</td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3"><RetailerBadge value={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RetailerCard>
  );
}

export function RetailerOffersPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Offers and Promotions" description="Create discounts, manage coupons, and launch campaign benefits." />
      <div className="grid gap-4 md:grid-cols-3">
        {retailerOffers.map((item) => (
          <RetailerCard key={item.name} className="bg-[#FFFFFF]">
            <p className="font-semibold">{item.name}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#255849]">Reach</span><span>{item.reach}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">Discount</span><span>{item.discount}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#255849]">State</span><RetailerBadge value={item.state} /></div>
            </div>
          </RetailerCard>
        ))}
      </div>
    </RetailerCard>
  );
}

export function RetailerReportsPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Reports and Analytics" description="Sales, profit, inventory, and customer insight reporting." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {retailerReports.map((item) => (
            <RetailerCard key={item.title} className="bg-[#FFFFFF]">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-[#255849]">{item.note}</p>
            </RetailerCard>
          ))}
        </div>
        <div className="space-y-4">
          <RetailerCard className="bg-[#FFFFFF]">
            <p className="font-semibold">Loading State</p>
            <div className="mt-4 space-y-3"><RetailerSkeleton className="h-10 w-2/3" /><RetailerSkeleton className="h-20 w-full" /><RetailerSkeleton className="h-20 w-full" /></div>
          </RetailerCard>
          <RetailerCard className="bg-[#FFFFFF]">
            <p className="font-semibold">Success and Error States</p>
            <div className="mt-4 rounded-2xl border border-[#E6ECEA] bg-[#E6ECEA] px-4 py-4 text-sm text-[#1F5C4A]">Sales summary exported successfully.</div>
            <div className="mt-3 rounded-2xl border border-[#E5D8C7] bg-[#FFFFFF] px-4 py-4 text-sm text-[#E5D8C7]">Refund sync pending for 2 transactions.</div>
          </RetailerCard>
        </div>
      </div>
    </RetailerCard>
  );
}

export function RetailerSettingsPage() {
  return (
    <RetailerCard>
      <RetailerSectionHeader title="Settings" description="Localization, workspace defaults, and notification preferences." />
      <div className="grid gap-4 md:grid-cols-2">
        <RetailerCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Notifications</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3">
            <span>Order and supplier alerts</span>
            <span className="text-sm font-medium text-[#1F5C4A]">Enabled</span>
          </div>
        </RetailerCard>
        <RetailerCard className="bg-[#FFFFFF]">
          <p className="font-semibold">Locale</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-inherit px-4 py-3">
            <span>Language</span>
            <span className="text-sm font-medium text-[#1F5C4A]">EN / HI / TE</span>
          </div>
        </RetailerCard>
      </div>
    </RetailerCard>
  );
}
