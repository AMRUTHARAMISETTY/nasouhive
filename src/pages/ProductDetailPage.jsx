import React from 'react';
import { Link, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import AnimatedButton from '../components/AnimatedButton';
import SustainabilityMeter from '../components/SustainabilityMeter';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  if (!product) return <div className="p-8">Product not found.</div>;

  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 text-center text-8xl">{product.image}</div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-primary text-2xl font-bold">${product.wholesalePrice}</p>
          <p className="text-sm">Origin: {product.origin}</p>
          <p className="text-sm">Carbon Footprint: {product.carbonFootprint}</p>
          <SustainabilityMeter value={product.eco ? 86 : 48} />
          <div className="flex gap-3">
            <AnimatedButton onClick={() => addToCart(product, 1)}>Add to Cart</AnimatedButton>
            <Link to={`/app/trace/${product.id}`} className="px-4 py-2 rounded-full border border-primary text-primary">Traceability</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
