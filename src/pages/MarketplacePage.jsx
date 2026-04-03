import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from '../components/TopNavbar';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

const MarketplacePage = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term);
  };

  const applyFilters = (search, filters = {}) => {
    let result = products;
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filters.eco) result = result.filter((p) => p.eco);
    if (filters.category && filters.category !== 'All') result = result.filter((p) => p.category === filters.category);
    if (filters.maxPrice) result = result.filter((p) => p.wholesalePrice <= filters.maxPrice);
    setFilteredProducts(result);
  };

  const count = useMemo(() => filteredProducts.length, [filteredProducts]);

  return (
    <div className="min-h-screen bg-cream">
      <TopNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        <p className="text-sm text-gray-500 mt-3">{count} products</p>
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <aside className="md:w-64"><FilterPanel onFilter={applyFilters} searchTerm={searchTerm} /></aside>
          <main className="flex-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
