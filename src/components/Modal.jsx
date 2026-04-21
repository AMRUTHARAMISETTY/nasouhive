import React from 'react';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-[#255849]/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-panel w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
