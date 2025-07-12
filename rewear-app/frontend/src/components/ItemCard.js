import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Coins } from 'lucide-react';

const ItemCard = ({ item, showOwner = true }) => {
  const getImageUrl = (imageName) => {
    return imageName ? `/uploads/${imageName}` : '/placeholder-image.jpg';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/items/${item.id}`} className="block group">
      <div className="card card-hover">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(item.images?.[0])}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          
          {/* Point Value Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-primary-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-medium">
              <Coins className="w-3 h-3" />
              <span>{item.point_value}</span>
            </div>
          </div>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
              {item.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Category */}
          <div className="mb-2">
            <h3 className="font-semibold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-secondary-500">{item.category_name}</p>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-secondary-600 text-sm line-clamp-2 mb-3">
              {item.description}
            </p>
          )}

          {/* Size and Type */}
          <div className="flex items-center space-x-4 mb-3">
            {item.size && (
              <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                Size {item.size}
              </span>
            )}
            {item.type && (
              <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                {item.type}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-secondary-500">
            {showOwner && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>{item.first_name} {item.last_name}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-secondary-500">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary-100">
            <div className="flex items-center space-x-2">
              {!item.is_available && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  Redeemed
                </span>
              )}
              {!item.is_approved && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Pending Approval
                </span>
              )}
              {item.is_available && item.is_approved && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
