export const retailerNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'products', label: 'Products', icon: 'box' },
  { key: 'inventory', label: 'Inventory', icon: 'archive' },
  { key: 'suppliers', label: 'Suppliers', icon: 'users' },
  { key: 'price-comparison', label: 'Price Comparison', icon: 'compare' },
  { key: 'orders', label: 'Orders', icon: 'bag' },
  { key: 'billing', label: 'Billing (POS)', icon: 'receipt' },
  { key: 'customers', label: 'Customers', icon: 'user' },
  { key: 'payments', label: 'Payments', icon: 'card' },
  { key: 'offers', label: 'Offers & Discounts', icon: 'gift' },
  { key: 'reports', label: 'Reports & Analytics', icon: 'chart' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export const retailerStats = [
  { label: 'Total Sales Today', value: '$82.4k', delta: '+14.2%', detail: 'Across online and in-store channels', tone: 'emerald' },
  { label: 'Orders Received', value: '246', delta: '+19', detail: '52 awaiting fulfillment handoff', tone: 'amber' },
  { label: 'Inventory Status', value: '91%', delta: 'Stable', detail: '7 SKUs near reorder threshold', tone: 'blue' },
  { label: 'Profit', value: '$18.7k', delta: '+8.7%', detail: 'Healthy blended margin performance', tone: 'violet' },
];

export const retailerRecentActivity = [
  { title: 'Bulk order approved for Urban Basket West', meta: '9 minutes ago', status: 'Approved' },
  { title: 'Price drop detected on Aero Smart Kettle', meta: '18 minutes ago', status: 'Low' },
  { title: 'New supplier quote received from ForgePlus', meta: '36 minutes ago', status: 'Running' },
  { title: 'Customer loyalty tier upgraded to Gold', meta: '1 hour ago', status: 'Active' },
];

export const retailerAlerts = [
  { label: 'Low stock', detail: 'Nova Noise Buds projected to run out in 2.3 days.', tone: 'Low' },
  { label: 'Supplier update', detail: 'Everloom Textiles reduced lead times on organic fiber rolls.', tone: 'Approved' },
  { label: 'Margin watch', detail: 'Desk lamp discount campaign is below target margin by 2.1%.', tone: 'Inspection' },
];

export const retailerProducts = [
  { sku: 'NH-1042', name: 'Aero Smart Kettle', category: 'Electronics', price: '$74', stock: 120, status: 'Active' },
  { sku: 'NH-1170', name: 'Luma Desk Lamp', category: 'Home Living', price: '$49', stock: 62, status: 'Active' },
  { sku: 'NH-1321', name: 'Nova Noise Buds', category: 'Electronics', price: '$119', stock: 18, status: 'Low' },
  { sku: 'NH-1612', name: 'Glow Skin Serum', category: 'Beauty', price: '$42', stock: 88, status: 'Active' },
];

export const retailerInventory = [
  { location: 'Front Store', fill: 72, stock: '1,240 units', status: 'Healthy' },
  { location: 'Back Warehouse', fill: 58, stock: '890 units', status: 'Healthy' },
  { location: 'Transit Buffer', fill: 26, stock: '220 units', status: 'Low' },
];

export const retailerSuppliers = [
  { name: 'Everloom Textiles', products: 42, purchaseHistory: '$124k', payment: 'Paid' },
  { name: 'ForgePlus Manufacturing', products: 18, purchaseHistory: '$86k', payment: 'Due' },
  { name: 'BlueArc Consumer Goods', products: 31, purchaseHistory: '$154k', payment: 'Paid' },
];

export const priceComparisons = [
  { manufacturer: 'North Axis', price: '$52', delivery: '2 days', rating: '4.8', badge: 'Best Deal' },
  { manufacturer: 'ForgePlus', price: '$55', delivery: '1 day', rating: '4.6', badge: 'Fastest' },
  { manufacturer: 'LeafTone Labs', price: '$58', delivery: '3 days', rating: '4.9', badge: 'Top Rated' },
];

export const retailerOrders = [
  { id: 'RT-4021', supplier: 'North Axis', total: '$8,420', status: 'Requested' },
  { id: 'RT-4020', supplier: 'ForgePlus', total: '$12,130', status: 'Approved' },
  { id: 'RT-4018', supplier: 'BlueArc', total: '$18,940', status: 'Shipped' },
  { id: 'RT-4016', supplier: 'Everloom', total: '$9,120', status: 'Delivered' },
];

export const posPayments = [
  { type: 'Cash', detail: 'In-store settlements' },
  { type: 'UPI', detail: 'Instant retailer collections' },
  { type: 'Card', detail: 'Credit and debit support' },
];

export const retailerCustomers = [
  { name: 'Anika Sharma', lifetime: '$1,420', loyalty: 'Gold', discount: '12%' },
  { name: 'Kiran Mehta', lifetime: '$860', loyalty: 'Silver', discount: '7%' },
  { name: 'Maya Joseph', lifetime: '$420', loyalty: 'Bronze', discount: '3%' },
];

export const retailerPayments = [
  { id: 'PM-201', method: 'UPI', amount: '$420', status: 'Success' },
  { id: 'PM-202', method: 'Card', amount: '$1,240', status: 'Success' },
  { id: 'PM-203', method: 'Refund', amount: '$82', status: 'Processing' },
];

export const retailerOffers = [
  { name: 'Festival Flash Sale', reach: '1.8k shoppers', discount: '20%', state: 'Active' },
  { name: 'Gold Tier Cashback', reach: '420 members', discount: '10%', state: 'Draft' },
  { name: 'Weekend Combo Offer', reach: '860 shoppers', discount: '15%', state: 'Scheduled' },
];

export const retailerReports = [
  { title: 'Sales report', value: '$482k', note: 'Up 12% month-on-month' },
  { title: 'Profit analysis', value: '22.4%', note: 'Margin improved with supplier shift' },
  { title: 'Customer trends', value: '68%', note: 'Repeat customers from loyalty offers' },
];
