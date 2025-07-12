import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import ItemCard from '../components/ItemCard';
import { Filter, Grid, List, Package } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    condition: '',
    size: '',
    minPoints: '',
    maxPoints: '',
    search: searchParams.get('search') || ''
  });

  // Categories and conditions for filters
  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear',
    'Shoes', 'Accessories', 'Athletic Wear', 'Other'
  ];

  const conditions = [
    'New with tags', 'Like new', 'Good', 'Fair', 'Worn'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10', '12', '14', '16'
  ];

  useEffect(() => {
    fetchItems();
  }, [searchParams, pagination.page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.size) params.append('size', filters.size);
      if (filters.minPoints) params.append('minPoints', filters.minPoints);
      if (filters.maxPoints) params.append('maxPoints', filters.maxPoints);
      if (filters.search) params.append('search', filters.search);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      const response = await axios.get(`/api/items?${params.toString()}`);
      setItems(response.data.items);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      });
      
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    const newFilters = {
      ...filters,
      search: searchData.term,
      category: searchData.category || filters.category
    };
    
    setFilters(newFilters);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (searchData.term) params.append('search', searchData.term);
    if (searchData.category || filters.category) {
      params.append('category', searchData.category || filters.category);
    }
    
    setSearchParams(params);
    
    // Reset to first page when searching
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    // Reset to first page when applying filters
    setPagination({
      ...pagination,
      page: 1
    });
    
    // Update URL parameters with all filters
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      condition: '',
      size: '',
      minPoints: '',
      maxPoints: '',
      search: ''
    });
    
    setSearchParams({});
    
    setPagination({
      ...pagination,
      page: 1
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
                initialSearch={filters.search}
                initialCategory={filters.category}
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
                  <select 
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Condition
                  </label>
                  <select 
                    name="condition"
                    value={filters.condition}
                    onChange={handleFilterChange}
                    className="w-full input-field"
                  >
                    <option value="">Any Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Size
                  </label>
                  <select 
                    name="size"
                    value={filters.size}
                    onChange={handleFilterChange}
                    className="w-full input-field"
                  >
                    <option value="">Any Size</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Point Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minPoints"
                      value={filters.minPoints}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full input-field"
                      min="0"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="maxPoints"
                      value={filters.maxPoints}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full input-field"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-secondary-100">
                  <button 
                    onClick={applyFilters}
                    className="btn-primary py-2"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="btn-secondary py-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-3">💡 Insights</h3>
              <div className="space-y-3 text-sm text-primary-700">
                <p>Popular this week: Vintage denim</p>
                <p>Most sustainable: Locally sourced items</p>
                <p>Best value: Items under 30 points</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary-600">
                {loading ? 'Loading items...' : `Showing ${items.length} of ${pagination.total} items`}
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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchItems} 
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && items.length === 0 && (
              <div className="card p-8 text-center">
                <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No items found</h3>
                <p className="text-secondary-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Items Grid */}
            {!loading && !error && items.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {items.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})}
                    disabled={pagination.page === 1}
                    className="btn-secondary py-2 px-4 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-secondary-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <button
                    onClick={() => setPagination({...pagination, page: Math.min(pagination.pages, pagination.page + 1)})}
                    disabled={pagination.page === pagination.pages}
                    className="btn-secondary py-2 px-4 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
