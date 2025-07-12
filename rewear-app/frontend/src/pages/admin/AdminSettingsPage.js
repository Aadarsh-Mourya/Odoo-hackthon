import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    welcomePoints: 50,
    maxItemsPerUser: 20,
    requireApproval: true,
    notifyAdminsOnNewItem: true,
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await axios.post('/api/admin/settings', settings);
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update settings. Please try again.');
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Platform Settings</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Welcome Points for New Users
            </label>
            <input
              type="number"
              name="welcomePoints"
              value={settings.welcomePoints}
              onChange={handleChange}
              className="input-field"
              min="0"
            />
            <p className="text-xs text-secondary-500 mt-1">
              Points given to new users upon registration
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Maximum Items Per User
            </label>
            <input
              type="number"
              name="maxItemsPerUser"
              value={settings.maxItemsPerUser}
              onChange={handleChange}
              className="input-field"
              min="1"
            />
            <p className="text-xs text-secondary-500 mt-1">
              Maximum number of items a user can list
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireApproval"
              name="requireApproval"
              checked={settings.requireApproval}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="requireApproval" className="ml-2 block text-sm text-secondary-900">
              Require Admin Approval for New Items
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyAdminsOnNewItem"
              name="notifyAdminsOnNewItem"
              checked={settings.notifyAdminsOnNewItem}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="notifyAdminsOnNewItem" className="ml-2 block text-sm text-secondary-900">
              Notify Admins on New Item Listing
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-secondary-900">
              Enable Maintenance Mode
            </label>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="btn-secondary flex items-center space-x-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
