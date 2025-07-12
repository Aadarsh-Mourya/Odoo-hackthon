import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, ShoppingBag, Plus, Shield } from 'lucide-react';
import SearchBar from './search/SearchBar';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (searchData) => {
    // Navigate to browse page with search params
    navigate(`/browse?search=${searchData.term}&category=${searchData.category}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-secondary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-xl text-secondary-900">ReWear</span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for clothing, shoes, accessories..."
            />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/browse" className="text-secondary-600 hover:text-primary-500 transition-colors">
              Browse Items
            </Link>
            <Link to="/how-it-works" className="text-secondary-600 hover:text-primary-500 transition-colors">
              How It Works
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Points Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-primary-700 font-medium text-sm">
                    {user.points} points
                  </span>
                </div>

                {/* Quick Actions */}
                <Link
                  to="/add-item"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">List Item</span>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-500 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                        <p className="text-xs text-primary-600 mt-1">
                          {user.points} points available
                        </p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/my-items"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Items</span>
                      </Link>
                      
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search items..."
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
