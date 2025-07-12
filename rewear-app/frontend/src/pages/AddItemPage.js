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
      
      // Convert category name to categoryId - ensure it's a number
      const categoryMap = {
        'Tops': 1, 'Bottoms': 2, 'Dresses': 3, 'Outerwear': 4,
        'Shoes': 5, 'Accessories': 6, 'Athletic Wear': 7, 'Other': 8
      };
      
      // Log detailed information for debugging
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        categoryId: categoryMap[formData.category] || 8,
        size: formData.size,
        condition: formData.condition,
        pointValue: formData.pointValue,
        brand: formData.brand,
        imageCount: imageFiles.length
      });
      
      const categoryId = categoryMap[formData.category] || 8;
      data.append('categoryId', categoryId);
      
      data.append('type', formData.type || formData.category); // Use category as type if not specified
      data.append('size', formData.size);
      data.append('condition', formData.condition);
      data.append('pointValue', Number(formData.pointValue)); // Ensure it's a number
      
      if (formData.brand) {
        data.append('brand', formData.brand);
      }
      
      // Add all images
      if (imageFiles.length === 0) {
        throw new Error('At least one image is required');
      }
      
      imageFiles.forEach((file, index) => {
        data.append('images', file);
        console.log(`Added image ${index+1}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
      });
      
      // Submit the form with more detailed error logging
      try {
        const response = await axios.post('/api/items', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // After successful submission
        await refreshUser(); // Refresh user data (in case points change)
        navigate(`/items/${response.data.item.id}`);
        
      } catch (apiError) {
        console.error('API Error Details:', apiError);
        if (apiError.response) {
          console.error('Error Response Data:', apiError.response.data);
          console.error('Error Status:', apiError.response.status);
          console.error('Error Headers:', apiError.response.headers);
          setSubmissionError(apiError.response.data.message || apiError.response.data.error || 'Server error creating item. Please try again.');
        } else if (apiError.request) {
          console.error('No response received:', apiError.request);
          setSubmissionError('No response received from server. Please check your connection and try again.');
        } else {
          setSubmissionError(apiError.message || 'An unknown error occurred. Please try again.');
        }
        throw apiError; // Re-throw to be caught by the outer catch block
      }
      
    } catch (error) {
      console.error('Error submitting item:', error);
      // The detailed error message will be set in the inner catch block
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
