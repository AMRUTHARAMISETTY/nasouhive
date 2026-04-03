import React from 'react';
import { useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import OrderTimeline from '../components/OrderTimeline';

const OrderTrackingPage = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Order {id}</h1>
        <div className="glass-card p-6">
          <OrderTimeline currentStatus="Manufacturing" />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
