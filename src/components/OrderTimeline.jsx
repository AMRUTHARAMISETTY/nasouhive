import React from 'react';
import { motion } from 'framer-motion';

const stages = ['Order Placed', 'Accepted', 'Manufacturing', 'Packed', 'Shipped', 'Delivered'];

const OrderTimeline = ({ currentStatus }) => {
  const currentIndex = stages.indexOf(currentStatus);

  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 z-0" />
      <div className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 z-0" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }} />
      <div className="flex justify-between min-w-[700px] relative z-10">
        {stages.map((stage, idx) => (
          <div key={stage} className="text-center w-24">
            <motion.div
              animate={idx <= currentIndex ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${idx <= currentIndex ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'}`}
            >
              {idx + 1}
            </motion.div>
            <p className="text-xs mt-2 font-medium">{stage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
