import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/search/SearchBar';
import ImageUploadSection from '../components/product/ImageUploadSection';
import ProductInfoForm from '../components/product/ProductInfoForm';
import PreviousListings from '../components/product/PreviousListings';

const AddItemPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    size: '',
    brand: '',
    pointValue: 10, // Default point value
    type: '' // Add the type field
  });
  
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [previousListings, setPreviousListings] = useState([]);
  const [fetchingPrevious, setFetchingPrevious] = useState(true);

  useEffect(() => {
    // Fetch user's previous listings
    const fetchPreviousListings = async () => {
      try {
        const response = await axios.get('/api/items/user/my-items');
        setPreviousListings(response.data.slice(0, 4)); // Get only the first 4 items
      } catch (error) {
        console.error('Error fetching previous listings:', error);
      } finally {
        setFetchingPrevious(false);
      }
    };

    fetchPreviousListings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (files) => {
    if (images.length + files.length > 5) {
      setErrors({
        ...errors,
        images: 'Maximum 5 images allowed'
      });
      return;
    }
    
    // Preview images
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...files]);
    
    // Clear image error if it exists
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    
    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (imageFiles.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmissionError('');
    
    try {
      // Create form data to send images
      const data = new FormData();
      
      // Add all form fields with proper mapping to match backend expectations
      data.append('title', formData.title);
      data.append('description', formData.description);
      
      // Convert category name to categoryId - this is a critical fix
      // For now using a basic mapping - ideally would fetch categories from backend
      const categoryMap = {
        'Tops': 1, 'Bottoms': 2, 'Dresses': 3, 'Outerwear': 4,
        'Shoes': 5, 'Accessories': 6, 'Athletic Wear': 7, 'Other': 8
      };
      data.append('categoryId', categoryMap[formData.category] || 8); // Default to 'Other' if not found
      
      data.append('type', formData.type || formData.category); // Use category as type if not specified
      data.append('size', formData.size);
      data.append('condition', formData.condition);
      data.append('pointValue', formData.pointValue); // Backend requires this field
      
      if (formData.brand) {
        data.append('brand', formData.brand);
      }
      
      // Add all images
      imageFiles.forEach(file => {
        data.append('images', file);
      });
      
      console.log('Submitting form data:', Object.fromEntries(data));
      
      // Submit the form
      const response = await axios.post('/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // After successful submission
      await refreshUser(); // Refresh user data (in case points change)
      navigate(`/item/${response.data.item.id}`);
      
    } catch (error) {
      console.error('Error submitting item:', error);
      setSubmissionError(
        error.response?.data?.error || 
        'Something went wrong while submitting your item. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    navigate(`/browse?search=${searchData.term}&category=${searchData.category}`);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Area */}
      <div className="bg-white border-b border-secondary-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary-900">Product Add Page</h1>
          
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
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Image Upload Section */}
          <div className="w-full md:w-2/5">
            <ImageUploadSection 
              images={images}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              error={errors.images}
            />
          </div>
          
          {/* Right Side - Product Information Section */}
          <div className="w-full md:w-3/5">
            <ProductInfoForm 
              formData={formData}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              submissionError={submissionError}
            />
          </div>
        </div>
      </div>
      
      {/* Previous Listings Section */}
      <div className="max-w-7xl mx-auto p-4 mt-8">
        <PreviousListings 
          items={previousListings}
          loading={fetchingPrevious}
        />
      </div>
    </div>
  );
};

export default AddItemPage;
