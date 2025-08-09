import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colors } from '../../utils/colors';
import { api } from '../../services/api';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create user via API
      await api.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'tenant', // Default role for registration
        isActive: true,
      });

      // Registration successful, redirect to login
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your credentials.' 
        } 
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: '8px',
    textAlign: 'center',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    opacity: isLoading ? 0.7 : 1,
  };

  const errorStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '14px',
    marginTop: '8px',
    textAlign: 'center',
    padding: '8px',
    backgroundColor: '#FEF2F2',
    borderRadius: '6px',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={formStyle}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join Wezo - Your Premium Villa Rental Platform</p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Create a password (min 6 characters)"
              required
              disabled={isLoading}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <motion.button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            whileHover={!isLoading ? { backgroundColor: colors.primaryHover } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          <motion.button
            type="button"
            style={{
              ...buttonStyle,
              marginTop: '12px',
              backgroundColor: '#6B7280',
            }}
            onClick={() => navigate('/login')}
            disabled={isLoading}
            whileHover={!isLoading ? { backgroundColor: '#4B5563' } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            Back to Login
          </motion.button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.5',
          }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;