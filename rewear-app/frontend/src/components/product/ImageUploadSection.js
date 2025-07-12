import React from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ImageUploadSection = ({ images, onImageChange, onRemoveImage, error }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onImageChange(files);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-100 p-6">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4">
        Add Images
      </h2>
      
      <div className={`border-2 border-dashed rounded-lg p-6 text-center h-96 flex flex-col items-center justify-center ${error ? 'border-red-500' : 'border-secondary-300'}`}>
        {images.length === 0 ? (
          <div>
            <Camera className="mx-auto h-16 w-16 text-secondary-400" />
            <div className="mt-4 flex text-sm justify-center">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 hover:text-primary-700">
                <span className="text-lg">Upload images</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-sm text-secondary-500 mt-2">
              PNG, JPG, WEBP up to 5MB each (max 5 images)
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-secondary-200">
                  <img 
                    src={image} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-1 right-1 bg-secondary-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <div className="flex items-center justify-center aspect-square border border-secondary-200 border-dashed rounded-md">
                  <label htmlFor="more-images" className="cursor-pointer text-secondary-500 flex flex-col items-center justify-center w-full h-full hover:bg-secondary-50 transition-colors">
                    <Upload className="w-8 h-8 mb-1" />
                    <span className="text-sm">Add more</span>
                    <input 
                      id="more-images" 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <div className="mt-4 text-sm text-secondary-600">
        <p>• High-quality images increase your chances of approval</p>
        <p>• Include multiple angles of your item</p>
        <p>• Good lighting helps showcase your item better</p>
      </div>
    </div>
  );
};

export default ImageUploadSection;
