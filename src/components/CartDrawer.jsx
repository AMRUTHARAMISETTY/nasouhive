import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-40" />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 max-w-[90vw] glass-panel z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={onClose} className="text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 glass p-3 rounded-xl">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-primary">${item.wholesalePrice}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white/20">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white/20">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 text-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-white/20">
              <div className="flex justify-between text-lg font-bold mb-4"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
              <Link to="/app/cart" onClick={onClose}><button className="w-full bg-primary text-white py-3 rounded-full">View Cart</button></Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
