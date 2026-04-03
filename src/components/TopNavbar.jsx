import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const TopNavbar = () => {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-lg border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/app" className="font-bold text-primary text-xl">Nasuo Hive</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/app/marketplace">Marketplace</Link>
            <button onClick={() => setOpen(true)} className="bg-primary text-white rounded-full px-3 py-1">
              Cart ({totalItems})
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TopNavbar;
