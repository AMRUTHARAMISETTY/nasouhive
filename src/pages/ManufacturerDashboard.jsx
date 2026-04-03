import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import { manufacturerOrders, products } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ManufacturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Orders', data: [12, 19, 24, 28, 35], borderColor: '#1F5C4A', tension: 0.3 },
      { label: 'Revenue (k$)', data: [8, 15, 22, 31, 42], borderColor: '#255849', tension: 0.3 },
    ],
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar role="manufacturer" activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="text-center"><p className="text-gray-500">Total Orders</p><p className="text-3xl font-bold text-primary">{manufacturerOrders.length}</p></GlassCard>
                <GlassCard className="text-center"><p className="text-gray-500">Active Products</p><p className="text-3xl font-bold text-primary">{products.length}</p></GlassCard>
                <GlassCard className="text-center"><p className="text-gray-500">Pending Shipments</p><p className="text-3xl font-bold text-primary">3</p></GlassCard>
                <GlassCard className="text-center"><p className="text-gray-500">Revenue (MTD)</p><p className="text-3xl font-bold text-primary">$42,300</p></GlassCard>
              </div>
              <GlassCard className="p-4"><Line data={chartData} /></GlassCard>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
