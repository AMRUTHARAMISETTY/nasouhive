import React, { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { manufacturerNavItems } from '../../data/manufacturerDashboardData';
import { MobileAppShell } from '../mobile/MobileAppShell';

const titleMap = {
  dashboard: 'Dashboard',
  'raw-materials': 'Raw Materials',
  planning: 'Planning',
  manufacturing: 'Manufacturing',
  inventory: 'Inventory',
  quality: 'Quality',
  machines: 'Machines',
  'supply-chain': 'Supply Chain',
  orders: 'Orders',
  warehouses: 'Warehouses',
  reports: 'Analytics',
  settings: 'Settings',
};

const iconMap = {
  dashboard: 'home',
  'raw-materials': 'box',
  planning: 'orders',
  manufacturing: 'factory',
  inventory: 'grid',
  quality: 'leaf',
  machines: 'factory',
  'supply-chain': 'box',
  orders: 'orders',
  warehouses: 'grid',
  reports: 'chart',
  settings: 'settings',
};

function ManufacturerLayout() {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const sectionKey = useMemo(() => location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard', [location.pathname]);
  const pageTitle = titleMap[sectionKey] ?? 'Manufacturer';
  const navItems = useMemo(
    () =>
      manufacturerNavItems.map((item) => ({
        ...item,
        icon: iconMap[item.key] || 'grid',
        shortLabel: item.key === 'raw-materials' ? 'Raw' : item.key === 'supply-chain' ? 'Chain' : item.key === 'dashboard' ? 'Home' : item.label,
        to: item.key === 'dashboard' ? '/app/manufacturer/dashboard' : `/app/manufacturer/${item.key}`,
      })),
    [],
  );

  return (
    <MobileAppShell title={pageTitle} eyebrow="Manufacturer Portal" navItems={navItems} search={search} setSearch={setSearch}>
      <Outlet context={{ search }} />
    </MobileAppShell>
  );
}

export default ManufacturerLayout;
