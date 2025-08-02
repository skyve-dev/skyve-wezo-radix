import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockVillas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../utils/colors';

const VillaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const villa = mockVillas.find(v => v.id === id);

  if (!villa) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Villa not found</h1>
        <button onClick={() => navigate('/listings')}>
          Back to Listings
        </button>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/villas/${villa.id}`, action: 'booking' } });
      return;
    }
    navigate(`/bookings/new?villa=${villa.id}`);
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '30px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '10px',
  };

  const locationStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '20px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '30px',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '20px',
  };

  const amenitiesStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
  };

  const amenityTagStyle: React.CSSProperties = {
    fontSize: '14px',
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '8px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '15px',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={villa.images[0]}
        alt={villa.name}
        style={imageStyle}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 style={titleStyle}>{villa.name}</h1>
        <p style={locationStyle}>{villa.location}</p>
        <p style={descriptionStyle}>{villa.description}</p>
        
        <div style={priceStyle}>
          From AED {villa.pricing.weekday}/night • Up to {villa.maxVisitors} guests
        </div>

        <div style={amenitiesStyle}>
          {villa.amenities.map((amenity, index) => (
            <span key={index} style={amenityTagStyle}>
              {amenity}
            </span>
          ))}
        </div>

        <div>
          <motion.button
            style={buttonStyle}
            onClick={handleBookNow}
            whileHover={{ backgroundColor: colors.primaryHover }}
            whileTap={{ scale: 0.98 }}
          >
            {isAuthenticated ? 'Book Now' : 'Sign In to Book'}
          </motion.button>
          <motion.button
            style={secondaryButtonStyle}
            onClick={() => navigate('/listings')}
            whileHover={{ backgroundColor: '#4b5563' }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Listings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VillaDetailsPage;