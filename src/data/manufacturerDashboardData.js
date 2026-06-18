export const manufacturerNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'raw-materials', label: 'Raw Materials', icon: 'layers' },
  { key: 'planning', label: 'Production Planning', icon: 'calendar' },
  { key: 'manufacturing', label: 'Manufacturing', icon: 'flow' },
  { key: 'inventory', label: 'Inventory', icon: 'archive' },
  { key: 'quality', label: 'Quality Control', icon: 'shield' },
  { key: 'machines', label: 'Machines', icon: 'cpu' },
  { key: 'supply-chain', label: 'Supply Chain', icon: 'truck' },
  { key: 'orders', label: 'Orders', icon: 'file' },
  { key: 'warehouses', label: 'Warehouses', icon: 'map' },
  { key: 'reports', label: 'Reports & Analytics', icon: 'chart' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export const manufacturerStats = [
  { label: 'Total Production Today', value: '18,420', delta: '+12.4%', detail: 'Units across 5 lines', tone: 'emerald' },
  { label: 'Active Orders', value: '128', delta: '+8 new', detail: '42 high-priority retailer orders', tone: 'amber' },
  { label: 'Inventory Level', value: '86%', delta: '-4.1%', detail: '2 SKUs approaching threshold', tone: 'blue' },
  { label: 'Revenue', value: '$2.48M', delta: '+18.9%', detail: 'Month-to-date billed revenue', tone: 'violet' },
];

export const manufacturerRecentActivity = [
  { title: 'New quotation request from GreenMart', meta: '12 minutes ago', state: 'info' },
  { title: 'Shipment NH-204 delayed at Chennai hub', meta: '28 minutes ago', state: 'warning' },
  { title: 'Packaging resin stock crossed safety threshold', meta: '41 minutes ago', state: 'danger' },
  { title: 'Batch B-903 passed final QA inspection', meta: '1 hour ago', state: 'success' },
];

export const manufacturerAlerts = [
  { label: 'Low stock', detail: 'Biopolymer pellets below reorder point in WH-02.', tone: 'warning' },
  { label: 'Machine downtime', detail: 'Line M-14 maintenance window overlaps tonight shift.', tone: 'danger' },
  { label: 'Delayed shipments', detail: '3 outbound orders projected to miss promised ETA.', tone: 'info' },
];

export const rawMaterials = [
  { name: 'Organic Fiber Roll', supplier: 'Everloom Textiles', stock: '2,480 kg', quality: 'Approved', status: 'Healthy' },
  { name: 'Recycled Resin', supplier: 'CircularCore', stock: '640 kg', quality: 'Inspection', status: 'Low' },
  { name: 'Natural Dye Compound', supplier: 'LeafTone Labs', stock: '1,120 L', quality: 'Approved', status: 'Healthy' },
  { name: 'Aluminum Fittings', supplier: 'ForgePlus', stock: '310 units', quality: 'Hold', status: 'Critical' },
];

export const productionSchedule = [
  { time: '08:00', line: 'Line A', job: 'Eco Bottle Batch 42', assignee: 'Shift Alpha', status: 'Running' },
  { time: '11:00', line: 'Line C', job: 'Tote Assembly Lot 18', assignee: 'Shift Beta', status: 'Queued' },
  { time: '14:00', line: 'Line B', job: 'Labeling Cycle 11', assignee: 'Shift Alpha', status: 'Inspection' },
  { time: '17:00', line: 'Line D', job: 'Final Packaging NH-28', assignee: 'Shift Gamma', status: 'Ready' },
];

export const manufacturingSteps = [
  { name: 'Cutting', progress: 100, workers: 14, status: 'Completed' },
  { name: 'Assembly', progress: 78, workers: 11, status: 'Running' },
  { name: 'Testing', progress: 46, workers: 7, status: 'Queued' },
];

export const machineCards = [
  { name: 'M-14 Press', status: 'Maintenance', utilization: '64%', nextService: 'Today, 18:00' },
  { name: 'Laser Cutter X2', status: 'Active', utilization: '91%', nextService: 'Apr 20' },
  { name: 'Packaging Arm P7', status: 'Idle', utilization: '38%', nextService: 'Apr 25' },
];

export const inventoryBuckets = [
  { label: 'Raw Materials', value: '41%', amount: '$640k' },
  { label: 'WIP', value: '23%', amount: '$350k' },
  { label: 'Finished Goods', value: '36%', amount: '$520k' },
];

export const qualityReports = [
  { batch: 'B-903', result: 'Pass', defects: '0.4%', inspector: 'Priya Nair' },
  { batch: 'B-904', result: 'Fail', defects: '3.1%', inspector: 'Karan Bose' },
  { batch: 'B-905', result: 'Pass', defects: '0.8%', inspector: 'Asha Thomas' },
];

export const supplyChainItems = [
  { vendor: 'NorthWind Logistics', route: 'Plant 1 to Hyderabad DC', eta: 'Active', progress: 74 },
  { vendor: 'SwiftHaul', route: 'Plant 2 to Pune Retail Hub', eta: 'Delayed', progress: 58 },
  { vendor: 'BlueArc Freight', route: 'Plant 1 to Chennai Port', eta: 'Active', progress: 88 },
];

export const quotationOrders = [
  { id: 'Q-2104', retailer: 'GreenMart', amount: '$148,000', stage: 'Pending Approval', priority: 'High' },
  { id: 'Q-2105', retailer: 'Urban Basket', amount: '$84,500', stage: 'Approved', priority: 'Medium' },
  { id: 'Q-2106', retailer: 'EcoTrail', amount: '$196,200', stage: 'Inspection', priority: 'High' },
];

export const warehouses = [
  { name: 'WH-01 Bengaluru', fill: 82, skus: 142, temperature: '21 C' },
  { name: 'WH-02 Hyderabad', fill: 64, skus: 97, temperature: '23 C' },
  { name: 'WH-03 Pune', fill: 48, skus: 75, temperature: '20 C' },
];

export const reportCards = [
  { title: 'Production efficiency', value: '94.2%', note: 'Up 3.6% from last cycle' },
  { title: 'Cost per finished unit', value: '$12.80', note: 'Down 1.8% with supplier renegotiation' },
  { title: 'Waste tracking', value: '2.4%', note: 'Below quarterly target threshold' },
];
