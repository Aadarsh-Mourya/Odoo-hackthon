import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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
      await register(formData);
    } catch (error) {
      console.error('Registration failed:', error);
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
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Create Account</h1>
        <p className="text-secondary-600">Join our sustainable fashion community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="First Name"
          type="text"
          name="field1"
          value={formData.field1}
          onChange={handleChange}
          placeholder="Enter your first name"
          required
        />

        <Input
          label="Last Name"
          type="text"
          name="field2"
          value={formData.field2}
          onChange={handleChange}
          placeholder="Enter your last name"
          required
        />

        <Input
          label="Email"
          type="email"
          name="field3"
          value={formData.field3}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="field4"
          value={formData.field4}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        <div className="bg-primary-50 p-4 rounded-lg">
          <p className="text-sm text-primary-700">
            <strong>Personalized Sign/Signup System for Social Login:</strong><br/>
            Redirects to dashboard upon success.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Register
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-secondary-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
