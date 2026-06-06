import React, { useMemo, useState } from 'react';
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
  labels: ['Online', 'In-store', 'Bulk B2B'],
  datasets: [{ data: [46, 34, 20], backgroundColor: ['#1F5C4A', '#255849', '#E5D8C7'], borderWidth: 0 }],
};

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

  const handleWizardMethodSelect = () => {
    setShowWizardModal(false);
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
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition', viewMode === mode ? 'bg-[#1F5C4A] text-white' : 'text-[#255849] hover:bg-[#E6ECEA]')}>
                  {mode}
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
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
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
                  <td className="px-4 py-3 font-semibold text-[#1a1a1a]">{item.name}</td>
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
        type={type}
        customTitle="Add New Inventory"
        customSubtitle="Choose how you want to create stock entries"
      />
    </div>
  );
}

export function RetailerDashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#255849]">Retailer Commerce Hub</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1F5C4A] sm:text-4xl">Buy smarter, compare manufacturers, and sell with precision.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#255849] sm:text-base">A polished retailer workspace for procurement, pricing intelligence, fulfillment, POS, customer loyalty, and operational reporting inside the Nasuo Hive ecosystem.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <RetailerAction>Add Product</RetailerAction>
          <RetailerAction>Compare Prices</RetailerAction>
          <RetailerAction>Create Order</RetailerAction>
          <RetailerAction>Generate Invoice</RetailerAction>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {retailerStats.map((item) => <RetailerStat key={item.label} item={item} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RetailerCard>
          <RetailerSectionHeader title="Sales Trend" description="Daily sales velocity across channels and wholesale accounts." />
          <div className="h-[280px]"><Line data={salesTrend} options={chartOptions} /></div>
        </RetailerCard>
        <RetailerCard>
          <RetailerSectionHeader title="Top Selling Products" description="Best-performing SKUs in the current cycle." />
          <div className="h-[280px]"><Bar data={topSelling} options={chartOptions} /></div>
        </RetailerCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.05fr_0.95fr]">
        <RetailerCard>
          <RetailerSectionHeader title="Revenue Distribution" description="Mix across revenue channels." />
          <div className="mx-auto h-[240px] max-w-[260px]"><Doughnut data={revenueDistribution} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#1F5C4A' } } } }} /></div>
        </RetailerCard>
        <RetailerCard>
          <RetailerSectionHeader title="Recent Activity" description="Orders, stock alerts, and supplier updates." />
          <div className="space-y-3">
            {retailerRecentActivity.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-[#255849]">{item.meta}</p>
                  </div>
                  <RetailerBadge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </RetailerCard>
        <RetailerCard>
          <RetailerSectionHeader title="Smart Alerts" description="Actionable recommendations and margin signals." />
          <div className="space-y-3">
            {retailerAlerts.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#E5D8C7] bg-[#FFFFFF] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.label}</p>
                  <RetailerBadge value={item.tone} />
                </div>
                <p className="mt-2 text-sm text-[#255849]">{item.detail}</p>
              </div>
            ))}
          </div>
        </RetailerCard>
      </div>
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

