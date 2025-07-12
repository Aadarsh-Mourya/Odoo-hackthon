import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Coins, Calendar, MapPin, Heart, Share2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/search/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSearch = (searchData) => {
    navigate(`/browse?search=${searchData.term}&category=${searchData.category}`);
  };

  const getImageUrl = (imageName) => {
    return imageName ? `/uploads/${imageName}` : 'https://via.placeholder.com/400x300?text=No+Image';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Error</h2>
          <p className="text-secondary-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Area */}
      <div className="bg-white border-b border-secondary-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary-900">Item Listing</h1>
          
          <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <User className="w-5 h-5 text-secondary-600" />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-secondary-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-secondary-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for clothing, shoes, accessories..."
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {item && (
        <div className="max-w-7xl mx-auto p-4 mt-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Main Product Image */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden">
                <img
                  src={getImageUrl(item.images?.[selectedImage])}
                  alt={item.title}
                  className="w-full h-[500px] object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
            </div>
            
            {/* Right Side - Product Information */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-6">
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  {item.title}
                </h2>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm">
                    {item.category_name}
                  </span>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-sm">
                    {item.condition}
                  </span>
                  {item.size && (
                    <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-sm">
                      Size: {item.size}
                    </span>
                  )}
                </div>
                
                <div className="bg-primary-50 flex items-center justify-between p-4 rounded-lg mb-4">
                  <div>
                    <div className="text-sm text-secondary-600">Point Value</div>
                    <div className="text-2xl font-bold text-primary-600 flex items-center">
                      <Coins className="w-5 h-5 mr-1" />
                      {item.point_value} points
                    </div>
                  </div>
                  
                  <button className="btn-primary">
                    Redeem Item
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-900 mb-2">Description</h3>
                  <p className="text-secondary-600">{item.description}</p>
                </div>
                
                <div className="border-t border-secondary-100 pt-4">
                  <h3 className="font-semibold text-secondary-900 mb-2">Item Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {item.brand && (
                      <div>
                        <div className="text-sm text-secondary-500">Brand</div>
                        <div className="font-medium">{item.brand}</div>
                      </div>
                    )}
                    
                    {item.type && (
                      <div>
                        <div className="text-sm text-secondary-500">Type</div>
                        <div className="font-medium">{item.type}</div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm text-secondary-500">Listed By</div>
                      <div className="font-medium">{item.first_name} {item.last_name}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-secondary-500">Listed On</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-secondary-400" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-secondary-100">
                  <button className="flex items-center text-secondary-600 hover:text-primary-500">
                    <Heart className="w-5 h-5 mr-1" />
                    Save
                  </button>
                  <button className="flex items-center text-secondary-600 hover:text-primary-500">
                    <Share2 className="w-5 h-5 mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Gallery Section */}
          <div className="mt-8">
            <h3 className="font-semibold text-secondary-900 mb-4">Product Images</h3>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {item.images && item.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${item.title} - Image ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
