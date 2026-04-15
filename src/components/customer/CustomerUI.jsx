import React from 'react';
import { motion } from 'framer-motion';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function CustomerIcon({ name, className = 'h-5 w-5' }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' };
  const icons = {
    home: <path d="M4 10.5 12 4l8 6.5V20H4z" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 9V7a3 3 0 1 1 6 0v2" /></>,
    heart: <path d="m12 20-1.4-1.2C5.6 14.5 3 12.1 3 8.9A4.9 4.9 0 0 1 7.9 4c1.7 0 3.3.8 4.1 2.1A5 5 0 0 1 16.1 4 4.9 4.9 0 0 1 21 8.9c0 3.2-2.6 5.6-7.6 9.9Z" />,
    card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>,
    gift: <><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" /><path d="M2 7h20v5H2z" /><path d="M12 7v13" /><path d="M12 7H8.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7ZM12 7h3.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.2-1.7 2.7" /><path d="M12 17h.01" /></>,
    settings: <><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M15 17H5l1.2-1.2A2 2 0 0 0 7 14.4V10a5 5 0 1 1 10 0v4.4a2 2 0 0 0 .6 1.4L19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    cart: <><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /><path d="M3 4h2l2.1 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20l1-6.2L3 9.6l6.2-.9Z" />,
  };
  return <svg {...common}>{icons[name]}</svg>;
}

export function PortalCard({ children, className = '' }) {
  return <div className={cn('rounded-[20px] border border-white/60 bg-white/72 p-5 shadow-[0_18px_40px_rgba(24,53,44,0.08)] backdrop-blur-xl', className)}>{children}</div>;
}

export function ProductTile({ product, onOpen, onAdd }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[22px] border border-white/60 bg-white/78 p-4 shadow-[0_16px_34px_rgba(24,53,44,0.08)]">
      <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#f0ece4,#ffffff)] p-4">
        <div className="absolute right-3 top-3 rounded-full bg-[#1f5c4a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">{product.badge || product.category}</div>
        <div className="grid h-36 place-items-center rounded-[16px]" style={{ background: `radial-gradient(circle at top, ${product.accent}26, transparent 52%)` }}>
          <div className="h-20 w-20 rounded-[24px] border border-white/60 bg-white/70 shadow-[0_16px_30px_rgba(24,53,44,0.08)]" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-[#698079]">{product.category}</p>
        <button onClick={() => onOpen(product)} className="mt-1 text-left text-lg font-semibold tracking-[-0.03em] text-[#18352c]">{product.name}</button>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#587067]">
          <CustomerIcon name="star" className="h-4 w-4 fill-[#d0a86e] text-[#d0a86e]" />
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[#18352c]">${product.price}</p>
            {product.originalPrice ? <p className="text-sm text-[#81938d] line-through">${product.originalPrice}</p> : null}
          </div>
          <button onClick={() => onAdd(product)} className="rounded-full bg-[#1f5c4a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244f42]">Add to Cart</button>
        </div>
      </div>
    </motion.div>
  );
}

export function EmptyState({ title, detail }) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-[20px] border border-dashed border-[#d8cdbd] bg-white/55 text-center">
      <div>
        <p className="text-lg font-semibold text-[#18352c]">{title}</p>
        <p className="mt-2 max-w-sm text-sm text-[#6e837a]">{detail}</p>
      </div>
    </div>
  );
}
