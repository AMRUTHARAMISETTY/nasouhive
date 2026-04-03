import React from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="glass-panel p-4 flex gap-3 items-center">
              <div className="text-3xl">{item.image}</div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-primary">${item.wholesalePrice}</p>
              </div>
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 rounded p-1" />
              <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
          <Link to="/app/checkout" className="bg-primary text-white px-5 py-2 rounded-full">Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
