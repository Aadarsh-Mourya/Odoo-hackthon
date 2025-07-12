import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, Eye, Package } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminListingsPage = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/pending-items');
        setPendingItems(response.data);
      } catch (err) {
        console.error('Error fetching pending items:', err);
        setError('Failed to load pending items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingItems();
  }, []);

  const handleApproveItem = async (itemId) => {
    try {
      await axios.post(`/api/admin/approve-item/${itemId}`);
      setPendingItems(pendingItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error approving item:', err);
      alert('Failed to approve item. Please try again.');
    }
  };

  const handleRejectItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to reject this item? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.post(`/api/admin/reject-item/${itemId}`);
      setPendingItems(pendingItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error rejecting item:', err);
      alert('Failed to reject item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Manage Listings</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">Pending Approval ({pendingItems.length})</h2>
        
        {pendingItems.length === 0 ? (
          <div className="card p-8 text-center">
            <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No pending items</h3>
            <p className="text-secondary-600">All items have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingItems.map(item => (
              <div key={item.id} className="card p-4">
                <div className="flex items-center">
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary-100 mr-4">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={`/uploads/${item.images[0]}`} 
                        alt={item.title}
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-secondary-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-sm text-secondary-600">{item.category_name} • {item.size} • {item.condition}</p>
                    <p className="text-sm text-secondary-600 mt-1">
                      From: {item.first_name} {item.last_name} ({item.email})
                    </p>
                    <p className="text-sm text-secondary-600 mt-1">
                      Points: <span className="font-medium text-primary-600">{item.point_value}</span>
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <a 
                      href={`/items/${item.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-secondary py-2 px-4 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </a>
                    
                    <button 
                      className="bg-green-100 text-green-600 hover:bg-green-200 py-2 px-4 rounded-lg flex items-center text-sm"
                      onClick={() => handleApproveItem(item.id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    
                    <button 
                      className="bg-red-100 text-red-600 hover:bg-red-200 py-2 px-4 rounded-lg flex items-center text-sm"
                      onClick={() => handleRejectItem(item.id)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListingsPage;
