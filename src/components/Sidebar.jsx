import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role = 'manufacturer', activeTab, setActiveTab }) => {
  const tabs = role === 'manufacturer'
    ? ['overview', 'products', 'orders', 'inventory', 'shipments']
    : ['overview', 'analytics', 'suppliers', 'orders'];

  return (
    <aside className="w-72 bg-white/60 backdrop-blur-lg border-r border-white/30 p-6 space-y-3">
      <Link to="/app" className="block text-primary font-bold mb-5">Nasuo Hive</Link>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`w-full text-left px-4 py-2 rounded-xl capitalize ${activeTab === tab ? 'bg-primary text-white' : 'bg-white/50'}`}
        >
          {tab}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
