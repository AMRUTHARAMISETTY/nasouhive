import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search products"
      onChange={(e) => onSearch(e.target.value)}
      className="w-full glass-panel px-4 py-3 outline-none"
    />
  );
};

export default SearchBar;
