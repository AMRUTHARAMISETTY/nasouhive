import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import { retailerSalesData } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RetailerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Sales', data: retailerSalesData.daily, backgroundColor: '#1F5C4A' }],
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar role="retailer" activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-5">
          <GlassCard className="text-center"><p className="text-sm text-gray-500">Weekly Sales</p><p className="text-3xl text-primary font-bold">$6,240</p></GlassCard>
          <GlassCard className="text-center"><p className="text-sm text-gray-500">Profit Margin</p><p className="text-3xl text-primary font-bold">{Math.round(retailerSalesData.profitMargin * 100)}%</p></GlassCard>
          <GlassCard className="text-center"><p className="text-sm text-gray-500">Stock Health</p><p className="text-3xl text-primary font-bold">92%</p></GlassCard>
        </div>
        <GlassCard><Bar data={data} /></GlassCard>
      </div>
    </div>
  );
};

export default RetailerDashboard;
