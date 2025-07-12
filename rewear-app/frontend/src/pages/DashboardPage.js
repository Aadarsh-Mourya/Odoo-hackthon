import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Coins, Package, TrendingUp, Clock, CheckCircle, Gift, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [itemsRedeemed, setItemsRedeemed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListed: 0,
    totalApproved: 0,
    totalRedeemed: 0,
    pointsEarned: 0
  });

  // Mock user data for demonstration
  const userProfile = {
    bio: "Sustainable fashion enthusiast passionate about reducing textile waste. I love finding unique pieces that tell a story.",
    phone: "+1 (555) 123-4567",
    joinDate: new Date(user?.memberSince || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    location: "Portland, OR"
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsResponse, redemptionsResponse, itemsRedeemedResponse] = await Promise.all([
          axios.get('/api/items/user/my-items'),
          axios.get('/api/redemptions/my-redemptions'),
          axios.get('/api/redemptions/my-items-redeemed')
        ]);

        setUserItems(itemsResponse.data);
        setRedemptions(redemptionsResponse.data);
        setItemsRedeemed(itemsRedeemedResponse.data);

        // Calculate stats
        const items = itemsResponse.data;
        const approvedItems = items.filter(item => item.is_approved);
        const redeemedItems = items.filter(item => !item.is_available);
        const pointsEarned = approvedItems.reduce((sum, item) => sum + item.point_value, 0);

        setStats({
          totalListed: items.length,
          totalApproved: approvedItems.length,
          totalRedeemed: redeemedItems.length,
          pointsEarned
        });

        // Refresh user data to get latest points
        await refreshUser();

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Section with page title and navigation */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
            
            <div className="flex items-center space-x-6">
              <Link to="/browse" className="text-secondary-600 hover:text-primary-500 transition-colors">
                Browse Items
              </Link>
              <Link to="/add-item" className="text-secondary-600 hover:text-primary-500 transition-colors">
                List Item
              </Link>
              <Link to="/my-redemptions" className="text-secondary-600 hover:text-primary-500 transition-colors">
                Redemptions
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 px-3 py-1 rounded-full">
                <span className="text-primary-700 font-medium text-sm">
                  {user?.points || 0} points
                </span>
              </div>
              <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="card mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-secondary-200 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-16 h-16 text-secondary-400" />
                  )}
                </div>
              </div>
              
              {/* User Information Panels */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                  {user?.firstName} {user?.lastName}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-secondary-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Email</div>
                        <div className="font-medium">{user?.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Phone</div>
                        <div className="font-medium">{userProfile.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-secondary-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Member Since</div>
                        <div className="font-medium">{userProfile.joinDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-secondary-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Location</div>
                        <div className="font-medium">{userProfile.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Coins className="w-5 h-5 text-primary-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Available Points</div>
                        <div className="font-medium text-primary-600">{user?.points || 0}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Items Listed</div>
                        <div className="font-medium">{stats.totalListed}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Gift className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Points Earned</div>
                        <div className="font-medium">{stats.pointsEarned}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-secondary-500">Items Redeemed</div>
                        <div className="font-medium">{redemptions.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bio Section */}
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-secondary-700 mb-2">About Me</h3>
                  <p className="text-secondary-600">{userProfile.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-secondary-900">My Listings</h2>
            <Link to="/my-items" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          {userItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {userItems.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} showOwner={false} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No items listed yet</h3>
              <p className="text-secondary-600 mb-4">Start by listing your first item!</p>
              <Link to="/add-item" className="btn-primary inline-flex items-center">
                List Your First Item
              </Link>
            </div>
          )}
        </div>

        {/* My Purchases Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-secondary-900">My Purchases</h2>
            <Link to="/my-redemptions" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          {redemptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {redemptions.slice(0, 4).map((redemption) => (
                <div key={redemption.id} className="card card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={redemption.images?.[0] ? `/uploads/${redemption.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={redemption.item_title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-medium">
                        <Coins className="w-3 h-3" />
                        <span>{redemption.points_used}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary-900 line-clamp-1">
                      {redemption.item_title}
                    </h3>
                    <p className="text-sm text-secondary-500">From {redemption.owner_first_name} {redemption.owner_last_name}</p>
                    
                    <div className="mt-3 pt-3 border-t border-secondary-100 flex items-center justify-between">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Redeemed
                      </span>
                      <span className="text-xs text-secondary-500">
                        {new Date(redemption.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Clock className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No purchases yet</h3>
              <p className="text-secondary-600 mb-4">Browse items to start shopping!</p>
              <Link to="/browse" className="btn-primary inline-flex items-center">
                Browse Items
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
