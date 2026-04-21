import React, { useMemo, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  posPayments,
  priceComparisons,
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
import { ComparisonCard, RetailerAction, RetailerBadge, RetailerCard, RetailerSectionHeader, RetailerSkeleton, RetailerStat } from './RetailerUI';

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
      <RetailerSectionHeader title="Inventory Management" description="Low stock tracking, warehouse coverage, and restocking controls." />
      <div className="grid gap-4 md:grid-cols-3">
        {retailerInventory.map((item) => (
          <RetailerCard key={item.location} className="bg-[#FFFFFF]">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{item.location}</p>
              <RetailerBadge value={item.status} />
            </div>
            <div className="mt-4 h-2 rounded-full bg-[#EFEAE1]"><div className="h-2 rounded-full bg-[#1F5C4A]" style={{ width: `${item.fill}%` }} /></div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#255849]"><span>Fill {item.fill}%</span><span>{item.stock}</span></div>
          </RetailerCard>
        ))}
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

