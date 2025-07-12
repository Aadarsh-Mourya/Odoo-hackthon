import React from 'react';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const ProductInfoForm = ({ formData, errors, onChange, onSubmit, loading, submissionError }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-6">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4">
        Add Product Description
      </h2>
      
      {submissionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{submissionError}</p>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Item title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter a descriptive title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Describe your item (material, special features, etc.)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        {/* Point Value */}
        <div>
          <label htmlFor="pointValue" className="block text-sm font-medium text-secondary-700 mb-1">
            Point Value
          </label>
          <input
            type="number"
            id="pointValue"
            name="pointValue"
            value={formData.pointValue}
            onChange={onChange}
            min="1"
            max="100"
            className={`input-field ${errors.pointValue ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Suggested points for this item"
          />
          {errors.pointValue && (
            <p className="mt-1 text-sm text-red-600">{errors.pointValue}</p>
          )}
          <p className="mt-1 text-xs text-secondary-500">Suggested range: 5-50 points based on condition and value</p>
        </div>
        
        {/* Category and Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-secondary-700 mb-1">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={onChange}
              className={`input-field ${errors.condition ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>
        </div>
        
        {/* Size and Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-secondary-700 mb-1">
              Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={onChange}
              className={`input-field ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select size</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-secondary-700 mb-1">
              Brand (optional)
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={onChange}
              className="input-field"
              placeholder="Enter brand name"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-48 flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              'List for Swap'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInfoForm;
