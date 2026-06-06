import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './retailer/RetailerUI';

/**
 * AddStockWizard Component
 * Premium enterprise-grade modal wizard for adding inventory
 * Supports three input methods: Manual, Excel, Voice
 */
function AddStockWizard({ 
  open, 
  onClose, 
  onMethodSelect, 
  type = 'retailer',
  customTitle = 'Add New Inventory',
  customSubtitle = 'Choose how you want to create stock entries'
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const methods = [
    {
      id: 'manual',
      icon: '📝',
      title: 'Manual Entry',
      description: 'Add products one by one with pricing, images, stock count, SKU and warehouse.',
      features: ['Best for small additions', 'Full product customization', 'Real-time validation'],
      label: 'Flexible',
      cta: 'Start Manual Entry →',
      color: '#1F5C4A',
    },
    {
      id: 'excel',
      icon: '📊',
      title: 'Bulk Excel Upload',
      description: 'Import hundreds of products instantly using CSV, XLS or XLSX templates.',
      features: ['Download sample template', 'Drag & drop upload', 'Error preview'],
      label: 'Fastest',
      cta: 'Upload Spreadsheet →',
      color: '#255849',
    },
    {
      id: 'voice',
      icon: '🎙️',
      title: 'Voice Inventory Input',
      description: 'Speak product details naturally and generate inventory rows automatically.',
      features: ['AI speech recognition', 'Multi-product detection', 'Auto category assignment'],
      label: 'AI Powered',
      cta: 'Start Voice Capture →',
      color: '#1F5C4A',
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setIsExpanding(true);
    
    setTimeout(() => {
      onMethodSelect(methodId);
      setSelectedMethod(null);
      setIsExpanding(false);
    }, 600);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setIsExpanding(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-[#255849]/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-panel absolute left-1/2 top-1/2 z-50 w-[min(95vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-5 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="mb-8 flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-[#1F5C4A]">{customTitle}</h2>
            <p className="mt-2 text-lg text-[#255849]">{customSubtitle}</p>
          </motion.div>

          {/* Close Button */}
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="rounded-full p-2 text-[#255849] transition hover:bg-[#F7F5F2]"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Cards Grid */}
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Card Background Gradient */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/40 to-white/20 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main Card */}
                <motion.button
                  onClick={() => handleMethodSelect(method.id)}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex h-full flex-col gap-4 rounded-2xl border-2 p-6 transition-all duration-300',
                    selectedMethod === method.id
                      ? 'border-[#1F5C4A] bg-white shadow-lg'
                      : 'border-[#E5D8C7] bg-white/60 hover:border-[#1F5C4A] hover:bg-white hover:shadow-xl'
                  )}
                >
                  {/* Smart Label */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="absolute -right-3 -top-3 rounded-full bg-[#1F5C4A] px-3 py-1 text-xs font-bold text-white shadow-md"
                  >
                    {method.label}
                  </motion.div>

                  {/* Icon with Animation */}
                  <motion.div
                    className="text-5xl"
                    whileHover={
                      method.id === 'manual'
                        ? { rotate: [0, -10, 10, 0], transition: { duration: 0.6 } }
                        : method.id === 'excel'
                          ? { y: [0, -5, 5, 0], transition: { duration: 0.6 } }
                          : { scale: [1, 1.2, 1], transition: { duration: 0.6 } }
                    }
                  >
                    {method.icon}
                  </motion.div>

                  {/* Title */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[#1F5C4A]">{method.title}</h3>
                  </div>

                  {/* Features List */}
                  <motion.div className="space-y-2 text-left">
                    {method.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 + i * 0.05 }}
                        className="flex items-center gap-2 text-xs text-[#255849]"
                      >
                        <span className="text-[#1F5C4A]">✓</span>
                        {feature}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    className="mt-auto flex items-center gap-2 font-semibold text-[#1F5C4A] transition"
                    whileHover={{ x: 4 }}
                  >
                    <span>{method.cta}</span>
                  </motion.div>

                  {/* Hover Border Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#1F5C4A]"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                {/* Expanding Form Animation Indicator */}
                <AnimatePresence>
                  {selectedMethod === method.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 rounded-2xl border-2 border-[#1F5C4A] bg-white/50"
                    >
                      <motion.div
                        animate={{
                          pathLength: [0, 1],
                        }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mx-auto mb-2 h-6 w-6 rounded-full border-2 border-transparent border-t-[#1F5C4A]"
                          />
                          <p className="text-sm font-semibold text-[#1F5C4A]">Expanding...</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default AddStockWizard;
