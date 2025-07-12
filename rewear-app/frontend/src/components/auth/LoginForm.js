import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">R</span>
        </div>
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Welcome Back</h1>
        <p className="text-secondary-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-secondary-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
