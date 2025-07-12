import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Edit, Trash2, Mail, Calendar, Package, Coins } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Manage Users</h1>

      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="card p-4 flex items-center">
            {/* Avatar */}
            <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-secondary-400" />
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="font-medium text-lg">{user.first_name} {user.last_name}</h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                <div className="flex items-center text-sm text-secondary-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-secondary-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-sm text-secondary-600">
                  <Package className="w-4 h-4 mr-2" />
                  <span>Items Listed: {user.items_listed || 0}</span>
                </div>
                
                <div className="flex items-center text-sm text-secondary-600">
                  <Coins className="w-4 h-4 mr-2" />
                  <span>Points: {user.points || 0}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <button className="btn-secondary py-2 px-4 flex items-center text-sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </button>
              
              <button 
                className="bg-red-100 text-red-600 hover:bg-red-200 py-2 px-4 rounded-lg flex items-center text-sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-10">
            <p className="text-secondary-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
