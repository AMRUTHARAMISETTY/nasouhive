import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AnimatedButton from './AnimatedButton';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="glass-card overflow-hidden group"
    >
      <Link to={`/app/product/${product.id}`}>
        <div className="text-6xl p-4 text-center bg-white/30">{product.image}</div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.supplier}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-primary font-bold text-xl">${product.wholesalePrice}</span>
            {product.eco && <span className="eco-badge">Eco</span>}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <AnimatedButton onClick={() => addToCart(product, 1)} className="w-full">Add to Cart</AnimatedButton>
      </div>
    </motion.div>
  );
};

export default ProductCard;
