import React, { useState } from 'react';
import { Users, ShoppingBag, Package, Search, Settings, User, BarChart2 } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-secondary-200 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="input-field pl-10 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-secondary-600 font-medium">Admin Panel</span>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Primary Navigation Section */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex">
            <Link 
              to="/admin/dashboard" 
              className={`px-6 py-4 font-medium text-center flex-1 ${
                isActive('/admin/dashboard') 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-secondary-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart2 className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/users" 
              className={`px-6 py-4 font-medium text-center flex-1 ${
                isActive('/admin/users') 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-secondary-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Users</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/listings" 
              className={`px-6 py-4 font-medium text-center flex-1 ${
                isActive('/admin/listings') 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-secondary-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Listings</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/orders" 
              className={`px-6 py-4 font-medium text-center flex-1 ${
                isActive('/admin/orders') 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-secondary-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </div>
            </Link>
            
            <Link 
              to="/admin/settings" 
              className={`px-6 py-4 font-medium text-center flex-1 ${
                isActive('/admin/settings') 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-secondary-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
