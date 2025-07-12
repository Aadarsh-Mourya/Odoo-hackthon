import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Recycle, Users, Coins, TrendingUp, Star, Heart } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredResponse, statsResponse] = await Promise.all([
          axios.get('/api/public/featured'),
          axios.get('/api/public/stats')
        ]);
        
        setFeaturedItems(featuredResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              ReWear
              <span className="block text-primary-500 text-4xl md:text-5xl mt-2">
                Community Clothing Exchange
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your closet into a sustainable wardrobe. Share clothes you've outgrown, 
              discover pre-loved treasures, and earn points for every contribution to our eco-friendly community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/browse" className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
                <span>Start Browsing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-outline flex items-center space-x-2 text-lg px-8 py-4">
                <Heart className="w-5 h-5" />
                <span>Join Community</span>
              </Link>
            </div>

            {/* Stats */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {stats.totalItems || 0}
                  </div>
                  <div className="text-secondary-600">Items Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {stats.totalUsers || 0}
                  </div>
                  <div className="text-secondary-600">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {stats.totalExchanges || 0}
                  </div>
                  <div className="text-secondary-600">Successful Exchanges</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Our point-based system makes clothing exchange simple, fair, and rewarding for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                <Recycle className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">1. List Your Items</h3>
              <p className="text-secondary-600">
                Upload photos and details of clothes you no longer wear. 
                Set a point value based on condition and brand.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                <Coins className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">2. Earn Points</h3>
              <p className="text-secondary-600">
                When your items are approved, earn points equal to their value. 
                Start with 50 welcome points just for joining!
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                <Users className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">3. Shop & Redeem</h3>
              <p className="text-secondary-600">
                Browse the community's items and use your points to redeem pieces 
                that match your style and size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Featured Items
              </h2>
              <p className="text-lg text-secondary-600">
                Discover the latest additions to our community marketplace
              </p>
            </div>
            <Link 
              to="/browse" 
              className="btn-outline flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!loading && featuredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No items yet
              </h3>
              <p className="text-secondary-600 mb-6">
                Be the first to list an item and start building our community!
              </p>
              <Link to="/register" className="btn-primary">
                Join ReWear
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Join thousands of conscious consumers building a more sustainable fashion future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Eco-Friendly</h3>
              <p className="text-sm text-secondary-600">
                Reduce textile waste and promote circular fashion
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Fair Exchange</h3>
              <p className="text-sm text-secondary-600">
                Point-based system ensures equitable trades
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Community Driven</h3>
              <p className="text-sm text-secondary-600">
                Connect with like-minded fashion enthusiasts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Save Money</h3>
              <p className="text-sm text-secondary-600">
                Refresh your wardrobe without breaking the bank
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Closet?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our community of conscious fashionistas and start your sustainable style journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/browse" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-medium transition-colors text-lg"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
