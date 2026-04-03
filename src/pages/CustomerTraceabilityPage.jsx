import React from 'react';
import { useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { products } from '../data/mockData';

const CustomerTraceabilityPage = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === Number(productId));

  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Traceability</h1>
        <div className="glass-card p-6">
          <p className="text-xl font-semibold mb-2">{product?.name}</p>
          <ul className="space-y-2 text-sm">
            <li>Raw material sourced from audited vendor</li>
            <li>Manufactured in certified facility</li>
            <li>Packed with recyclable material</li>
            <li>Final-mile shipment carbon offset applied</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerTraceabilityPage;
