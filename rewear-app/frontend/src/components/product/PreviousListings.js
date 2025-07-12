import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import ItemCard from '../ItemCard';
import LoadingSpinner from '../LoadingSpinner';

const PreviousListings = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary-900">Previous Listings</h2>
        <Link to="/my-items" className="text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </Link>
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} showOwner={false} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-8 text-center">
          <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No items listed yet</h3>
          <p className="text-secondary-600 mb-4">This will be your first item!</p>
        </div>
      )}
    </div>
  );
};

export default PreviousListings;
