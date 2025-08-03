import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../utils/colors';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // Check if user was redirected from a specific page
      const from = location.state?.from || '/';
      navigate(from);
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous page or home
    const from = location.state?.from || '/';
    navigate(from);
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
    maxWidth: '400px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
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
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const errorStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '14px',
    marginTop: '8px',
    textAlign: 'center',
  };

  const demoInfoStyle: React.CSSProperties = {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#4B5563',
  };

  const demoCredentialStyle: React.CSSProperties = {
    marginTop: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
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
        <h1 style={titleStyle}>Wezo</h1>
        <p style={subtitleStyle}>Rental Property Platform</p>
        
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            style={buttonStyle}
            whileHover={{ backgroundColor: colors.primaryHover }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>
          
          <motion.button
            type="button"
            style={{
              ...buttonStyle,
              marginTop: '12px',
              backgroundColor: '#6B7280',
            }}
            onClick={handleCancel}
            whileHover={{ backgroundColor: '#4B5563' }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          
          {error && <p style={errorStyle}>{error}</p>}
        </form>
        
        <div style={demoInfoStyle}>
          <strong>Demo Credentials:</strong>
          <div style={demoCredentialStyle}>
            Tenant: tenant@example.com / password
          </div>
          <div style={demoCredentialStyle}>
            Homeowner: homeowner@example.com / password
          </div>
          <div style={demoCredentialStyle}>
            Admin: admin@example.com / password
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;