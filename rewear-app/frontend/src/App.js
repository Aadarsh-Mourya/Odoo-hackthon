import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BrowsePage from './pages/BrowsePage';
import AddItemPage from './pages/AddItemPage';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Layout Component
const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <Layout>
                  <HomePage />
                </Layout>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Layout showFooter={false}>
                    <LoginPage />
                  </Layout>
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Layout showFooter={false}>
                    <RegisterPage />
                  </Layout>
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Updated Browse Route */}
            <Route 
              path="/browse" 
              element={
                <Layout>
                  <BrowsePage />
                </Layout>
              } 
            />
            
            <Route 
              path="/add-item" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddItemPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/how-it-works" 
              element={
                <Layout>
                  <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-secondary-900 mb-4">How It Works</h1>
                      <p className="text-secondary-600">This page will be implemented next!</p>
                    </div>
                  </div>
                </Layout>
              } 
            />

            {/* Catch-all route */}
            <Route 
              path="*" 
              element={
                <Layout>
                  <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-secondary-400 mb-4">404</h1>
                      <h2 className="text-2xl font-bold text-secondary-900 mb-4">Page Not Found</h2>
                      <p className="text-secondary-600 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a href="/" className="btn-primary">
                        Go Home
                      </a>
                    </div>
                  </div>
                </Layout>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
