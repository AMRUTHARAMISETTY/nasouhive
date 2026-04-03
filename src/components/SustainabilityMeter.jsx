import React from 'react';

const SustainabilityMeter = ({ value = 78 }) => {
  return (
    <div className="glass-panel p-4">
      <p className="font-semibold mb-2">Sustainability Score</p>
      <div className="h-3 bg-white/40 rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <p className="text-sm mt-2 text-gray-600">{value}/100</p>
    </div>
  );
};

export default SustainabilityMeter;
