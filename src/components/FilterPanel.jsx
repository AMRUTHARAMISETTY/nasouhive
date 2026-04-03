import React, { useMemo, useState } from 'react';
import { products } from '../data/mockData';

const FilterPanel = ({ onFilter, searchTerm }) => {
  const [eco, setEco] = useState(false);
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20);
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], []);

  const apply = (next) => {
    onFilter(searchTerm, next);
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      <h3 className="font-semibold">Filters</h3>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={eco}
          onChange={(e) => {
            const v = e.target.checked;
            setEco(v);
            apply({ eco: v, category, maxPrice });
          }}
        />
        Eco only
      </label>
      <select
        value={category}
        onChange={(e) => {
          const v = e.target.value;
          setCategory(v);
          apply({ eco, category: v, maxPrice });
        }}
        className="w-full bg-white/70 rounded-lg p-2"
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div>
        <p className="text-sm mb-2">Max price: ${maxPrice}</p>
        <input
          type="range"
          min="1"
          max="30"
          value={maxPrice}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMaxPrice(v);
            apply({ eco, category, maxPrice: v });
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
