import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const placeOrder = () => {
    clearCart();
    navigate('/app/order/ORD001');
  };

  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-3xl mx-auto p-6 glass-card mt-8">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="mb-2">Shipping: Standard logistics lane</p>
        <p className="text-2xl font-bold text-primary mb-6">Total ${totalPrice.toFixed(2)}</p>
        <button onClick={placeOrder} className="bg-primary text-white px-6 py-3 rounded-full">Place Order</button>
      </div>
    </div>
  );
};

export default CheckoutPage;
