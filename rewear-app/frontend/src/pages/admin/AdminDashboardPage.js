import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, Package, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    totalOrders: 0,
    recentOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-500 text-sm">Total Users</div>
              <div className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalUsers}</div>
              <div className="text-xs text-green-600 mt-2">
                <span className="font-medium">+{stats.newUsers}</span> new this week
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Items Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-500 text-sm">Total Items</div>
              <div className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalItems}</div>
              <div className="text-xs text-yellow-600 mt-2">
                <span className="font-medium">{stats.pendingItems}</span> pending approval
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        {/* Orders Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-500 text-sm">Total Orders</div>
              <div className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalOrders}</div>
              <div className="text-xs text-green-600 mt-2">
                <span className="font-medium">{stats.recentOrders}</span> in the last 7 days
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Revenue Stats */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-500 text-sm">Total Points Exchanged</div>
              <div className="text-3xl font-bold text-secondary-900 mt-1">{stats.pointsExchanged || 0}</div>
              <div className="text-xs text-primary-600 mt-2">
                Platform health metric
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h2>
        <p className="text-secondary-600">Activity feed will be implemented in the next iteration.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
