import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const roles = [
  { key: 'manufacturer', title: 'Manufacturer', to: '/app/manufacturer', copy: 'Manage SKUs, batches, and outbound orders.' },
  { key: 'retailer', title: 'Retailer', to: '/app/retailer', copy: 'Track sales, procurement, and stock velocity.' },
  { key: 'buyer', title: 'Marketplace', to: '/app/marketplace', copy: 'Browse eco products and place orders.' },
];

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-2">Choose your role</h1>
        <p className="text-gray-600 mb-8">Nasuo Hive workspace</p>
        <div className="grid md:grid-cols-3 gap-5">
          {roles.map((role, idx) => (
            <motion.div key={role.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="glass-card">
              <h2 className="text-2xl font-semibold mb-2">{role.title}</h2>
              <p className="text-sm text-gray-600 mb-6">{role.copy}</p>
              <Link to={role.to} className="inline-block bg-primary text-white px-4 py-2 rounded-full">Open</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
