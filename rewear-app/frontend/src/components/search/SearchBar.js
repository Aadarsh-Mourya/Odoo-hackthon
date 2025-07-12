import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search for items...", 
  onSearch, 
  className = "",
  showCategories = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ term: searchTerm, category: selectedCategory });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>
      
      {showCategories && (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border-t border-b border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">Categories</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
        </select>
      )}
      
      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-r-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
