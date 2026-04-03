import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <motion.div whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}} className={`glass-card p-6 ${className}`}>
      {children}
    </motion.div>
  );
};

export default GlassCard;
