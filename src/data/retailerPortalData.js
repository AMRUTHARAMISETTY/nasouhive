export const retailerNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'inventory', label: 'Retailer Inventory', icon: 'archive' },
  { key: 'manufacturer-inventory', label: 'Manufacturer Marketplace', icon: 'factory' },
  { key: 'stock-requests', label: 'Stock Requests', icon: 'bag' },
  { key: 'stock-signals', label: 'Smart Stock Signals', icon: 'chart' },
  { key: 'warehouses', label: 'Warehouses', icon: 'archive' },
  { key: 'products', label: 'Products', icon: 'box' },
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
  { label: "Today's Sales", value: 'INR 8.4L', delta: '+15.2%', detail: 'Across all active stores', tone: 'emerald' },
  { label: 'Active Orders', value: '156', delta: '+12 new', detail: 'Awaiting manufacturer fulfillment', tone: 'amber' },
  { label: 'Inventory Health', value: '92%', delta: '3 low', detail: 'Healthy stock coverage', tone: 'blue' },
  { label: 'Profit Margin', value: '24.8%', delta: '+4.6%', detail: 'Current month average', tone: 'violet' },
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
  {
    sku: 'NH-1042',
    name: 'Aero Smart Kettle',
    category: 'Electronics',
    location: 'Front Store',
    price: '$74',
    stock: 120,
    fill: 72,
    status: 'Healthy',
    image: 'https://images.unsplash.com/photo-1571552879083-e93b6ea70d1d?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'NH-1170',
    name: 'Luma Desk Lamp',
    category: 'Home Living',
    location: 'Back Warehouse',
    price: '$49',
    stock: 62,
    fill: 58,
    status: 'Healthy',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'NH-1321',
    name: 'Nova Noise Buds',
    category: 'Electronics',
    location: 'Transit Buffer',
    price: '$119',
    stock: 18,
    fill: 26,
    status: 'Low',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'NH-1612',
    name: 'Glow Skin Serum',
    category: 'Beauty',
    location: 'Front Store',
    price: '$42',
    stock: 88,
    fill: 64,
    status: 'Healthy',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'NH-1820',
    name: 'Everloom Cotton Tote',
    category: 'Fashion',
    location: 'Back Warehouse',
    price: '$28',
    stock: 41,
    fill: 38,
    status: 'Low',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'NH-1907',
    name: 'Terra Ceramic Bowl Set',
    category: 'Kitchen',
    location: 'Front Store',
    price: '$36',
    stock: 95,
    fill: 81,
    status: 'Healthy',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=640&q=80',
  },
];

export const manufacturerInventory = [
  {
    sku: 'MF-2201',
    name: 'Aero Smart Kettle Batch',
    category: 'Electronics',
    productType: 'Smart Appliances',
    manufacturer: 'North Axis',
    price: '$52',
    stock: 860,
    leadTime: '2 days',
    minOrder: 40,
    rating: 4.8,
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'MF-2248',
    name: 'Nova Noise Buds Carton',
    category: 'Electronics',
    productType: 'Audio',
    manufacturer: 'ForgePlus',
    price: '$86',
    stock: 420,
    leadTime: '1 day',
    minOrder: 30,
    rating: 4.6,
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'MF-2314',
    name: 'Organic Fiber Tote Lot',
    category: 'Fashion',
    productType: 'Bags & Textiles',
    manufacturer: 'Everloom Textiles',
    price: '$18',
    stock: 1200,
    leadTime: '4 days',
    minOrder: 100,
    rating: 4.9,
    status: 'Production',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'MF-2409',
    name: 'Glow Serum Wholesale Case',
    category: 'Beauty',
    productType: 'Skincare',
    manufacturer: 'LeafTone Labs',
    price: '$29',
    stock: 340,
    leadTime: '3 days',
    minOrder: 24,
    rating: 4.7,
    status: 'Ready',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=640&q=80',
  },
  {
    sku: 'MF-2510',
    name: 'Ceramic Bowl Master Pack',
    category: 'Kitchen',
    productType: 'Tableware',
    manufacturer: 'BlueArc Consumer Goods',
    price: '$22',
    stock: 510,
    leadTime: '5 days',
    minOrder: 60,
    rating: 4.5,
    status: 'Inspection',
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=640&q=80',
  },
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
