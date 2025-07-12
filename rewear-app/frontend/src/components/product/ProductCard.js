import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ product, className = "" }) => {
  const {
    id,
    image,
    title,
    price,
    originalPrice,
    rating,
    condition,
    seller,
    isFavorited = false
  } = product;

  return (
    <div className={`card card-hover ${className}`}>
      <div className="relative">
        <img
          src={image || '/api/placeholder/300/300'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-secondary-50 transition-colors">
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            {condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-medium text-secondary-900 mb-2 hover:text-primary-500 transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-secondary-600 ml-1">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary-900">${price}</span>
            {originalPrice && (
              <span className="text-sm text-secondary-500 line-through">${originalPrice}</span>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-sm text-secondary-600">
          by {seller}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
