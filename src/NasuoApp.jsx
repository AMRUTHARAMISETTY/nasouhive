import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatbotWidget from './components/ChatbotWidget';
import ManufacturerLayout from './components/manufacturer/ManufacturerLayout';
import {
  InventoryPage,
  ManufacturerDashboardHome,
  ManufacturerSettingsPage,
  ManufacturingPage,
  OrdersPage,
  ProductionPlanningPage,
  QualityControlPage,
  RawMaterialsPage,
  ReportsAnalyticsPage,
  SupplyChainPage,
  WarehousesPage,
} from './components/manufacturer/ManufacturerSectionViews';
import RetailerLayout from './components/retailer/RetailerLayout';
import {
  RetailerBillingPage,
  RetailerCustomersPage,
  RetailerDashboardHome,
  RetailerInventoryPage,
  RetailerOffersPage,
  RetailerOrdersPage,
  RetailerPaymentsPage,
  RetailerPriceComparisonPage,
  RetailerProductsPage,
  RetailerReportsPage,
  RetailerSettingsPage,
  RetailerSuppliersPage,
} from './components/retailer/RetailerSectionViews';
import CustomerPortal from './pages/CustomerPortal';
import LoginRegisterPage from './pages/LoginRegisterPage';
import RoleSelectionPage from './pages/RoleSelectionPage';

function NasuoApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/app/auth" replace />} />
        <Route path="/auth" element={<RoleSelectionPage />} />
        <Route path="/auth/default" element={<Navigate to="/app/auth" replace />} />
        <Route path="/auth/:roleKey" element={<LoginRegisterPage />} />
        <Route path="/customer" element={<CustomerPortal />} />
        <Route path="/manufacturer/*" element={<ManufacturerLayout />}>
          <Route index element={<Navigate to="/app/manufacturer/dashboard" replace />} />
          <Route path="dashboard" element={<ManufacturerDashboardHome />} />
          <Route path="raw-materials" element={<RawMaterialsPage />} />
          <Route path="planning" element={<ProductionPlanningPage />} />
          <Route path="manufacturing" element={<ManufacturingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="quality" element={<QualityControlPage />} />
          <Route path="supply-chain" element={<SupplyChainPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="reports" element={<ReportsAnalyticsPage />} />
          <Route path="settings" element={<ManufacturerSettingsPage />} />
        </Route>
        <Route path="/retailer/*" element={<RetailerLayout />}>
          <Route index element={<Navigate to="/app/retailer/dashboard" replace />} />
          <Route path="dashboard" element={<RetailerDashboardHome />} />
          <Route path="products" element={<RetailerProductsPage />} />
          <Route path="inventory" element={<RetailerInventoryPage />} />
          <Route path="suppliers" element={<RetailerSuppliersPage />} />
          <Route path="price-comparison" element={<RetailerPriceComparisonPage />} />
          <Route path="orders" element={<RetailerOrdersPage />} />
          <Route path="billing" element={<RetailerBillingPage />} />
          <Route path="customers" element={<RetailerCustomersPage />} />
          <Route path="payments" element={<RetailerPaymentsPage />} />
          <Route path="offers" element={<RetailerOffersPage />} />
          <Route path="reports" element={<RetailerReportsPage />} />
          <Route path="settings" element={<RetailerSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/auth" replace />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}

export default NasuoApp;
