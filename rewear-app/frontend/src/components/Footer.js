import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Recycle, Users, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl">ReWear</span>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md">
              Building a sustainable future through community-driven clothing exchange. 
              Every item shared is a step towards reducing textile waste and promoting conscious fashion.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-secondary-300">
                <Heart className="w-4 h-4 text-primary-500" />
                <span className="text-sm">Made with love for the planet</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/browse" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/add-item" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Mission */}
          <div>
            <h3 className="font-semibold text-white mb-4">Our Mission</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-secondary-300">
                <Recycle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm">Reduce textile waste</span>
              </li>
              <li className="flex items-center space-x-2 text-secondary-300">
                <Users className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm">Build community</span>
              </li>
              <li className="flex items-center space-x-2 text-secondary-300">
                <Heart className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm">Promote sustainability</span>
              </li>
              <li className="flex items-center space-x-2 text-secondary-300">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm">Connect people</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary-400 text-sm mb-4 md:mb-0">
              © 2025 ReWear. All rights reserved. Building a sustainable fashion future.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
