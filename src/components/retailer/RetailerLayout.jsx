import React, { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { retailerNavItems } from '../../data/retailerPortalData';
import { MobileAppShell } from '../mobile/MobileAppShell';

const titleMap = {
  dashboard: 'Dashboard',
  products: 'Products',
  inventory: 'Inventory',
  'manufacturer-inventory': 'Catalog',
  'stock-requests': 'Stock Requests',
  'stock-signals': 'Stock Signals',
  warehouses: 'Warehouses',
  suppliers: 'Suppliers',
  'price-comparison': 'Prices',
  orders: 'Orders',
  billing: 'Billing',
  customers: 'Customers',
  payments: 'Payments',
  offers: 'Offers',
  reports: 'Analytics',
  settings: 'Settings',
};

const iconMap = {
  dashboard: 'home',
  products: 'box',
  inventory: 'grid',
  'manufacturer-inventory': 'factory',
  'stock-requests': 'orders',
  'stock-signals': 'chart',
  warehouses: 'grid',
  suppliers: 'factory',
  'price-comparison': 'chart',
  orders: 'orders',
  billing: 'orders',
  customers: 'user',
  payments: 'orders',
  offers: 'leaf',
  reports: 'chart',
  settings: 'settings',
};

function RetailerLayout() {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const sectionKey = useMemo(() => location.pathname.split('/').filter(Boolean).pop() ?? 'inventory', [location.pathname]);
  const pageTitle = titleMap[sectionKey] ?? 'Retailer';
  const navItems = useMemo(
    () =>
      retailerNavItems.map((item) => ({
        ...item,
        icon: iconMap[item.key] || 'grid',
        shortLabel: item.key === 'manufacturer-inventory' ? 'Catalog' : item.key === 'dashboard' ? 'Home' : item.label,
        to: `/app/retailer/${item.key}`,
      })),
    [],
  );

  return (
    <MobileAppShell title={pageTitle} eyebrow="Retailer Commerce Hub" navItems={navItems} search={search} setSearch={setSearch}>
      <Outlet context={{ search }} />
    </MobileAppShell>
  );
}

export default RetailerLayout;
