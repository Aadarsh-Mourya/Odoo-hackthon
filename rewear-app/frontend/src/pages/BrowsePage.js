import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import ProductCard from '../components/product/ProductCard';
import { Filter, Grid, List } from 'lucide-react';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: '',
    size: ''
  });

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      image: '/api/placeholder/300/300',
      title: 'Vintage Denim Jacket',
      price: 45,
      originalPrice: 120,
      rating: 4.5,
      condition: 'Good',
      seller: 'Sarah M.'
    },
    // Add more mock products...
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const handleSearch = (searchData) => {
    setSearchParams({
      search: searchData.term,
      category: searchData.category
    });
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Section */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Browse Items</h1>
              <p className="text-secondary-600 mt-1">
                Discover sustainable fashion from our community
              </p>
            </div>
            
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                onSearch={handleSearch}
                showCategories={true}
                placeholder="Search for clothing, shoes, accessories..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-secondary-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category
                  </label>
                  <select className="w-full input-field">
                    <option value="">All Categories</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Condition
                  </label>
                  <select className="w-full input-field">
                    <option value="">Any Condition</option>
                    <option value="new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Price Range
                  </label>
                  <select className="w-full input-field">
                    <option value="">Any Price</option>
                    <option value="0-25">$0 - $25</option>
                    <option value="25-50">$25 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100+">$100+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-3">💡 Insights</h3>
              <div className="space-y-3 text-sm text-primary-700">
                <p>Popular this week: Vintage denim</p>
                <p>Most sustainable: Locally sourced items</p>
                <p>Best value: Items under $30</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary-600">
                Showing {products.length} items
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'flex' : ''}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
