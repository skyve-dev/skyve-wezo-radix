import React, { useState } from 'react';
import { mockVillas } from '../../data/mockData';
import type { Villa } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../utils/colors';

const ListingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filteredVillas, setFilteredVillas] = useState<Villa[]>(mockVillas);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  const handleSearch = () => {
    let filtered = mockVillas;

    if (searchTerm) {
      filtered = filtered.filter(villa =>
        villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        villa.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(villa =>
        villa.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (maxPriceFilter) {
      const maxPrice = parseInt(maxPriceFilter);
      filtered = filtered.filter(villa => villa.pricing.weekday <= maxPrice);
    }

    setFilteredVillas(filtered);
  };

  const handleBookVilla = (villaId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/villas/${villaId}`, action: 'booking' } });
      return;
    }
    navigate(`/bookings/new?villa=${villaId}`);
  };

  const handleViewDetails = (villaId: string) => {
    navigate(`/villas/${villaId}`);
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '30px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '10px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '30px',
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    minWidth: '200px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const cardContentStyle: React.CSSProperties = {
    padding: '20px',
  };

  const villaNameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  };

  const locationStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '10px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '15px',
    lineHeight: '1.5',
  };

  const amenitiesStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '15px',
  };

  const amenityTagStyle: React.CSSProperties = {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '6px',
  };

  const priceInfoStyle: React.CSSProperties = {
    marginBottom: '15px',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '5px',
  };

  const capacityStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    flex: 1,
    backgroundColor: colors.primary,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    flex: 1,
    backgroundColor: '#6b7280',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Villa Listings</h1>
        <p style={subtitleStyle}>
          Discover luxury villas in Ras Al Khaimah for your perfect getaway
        </p>
      </div>

      <div style={filtersStyle}>
        <input
          type="text"
          placeholder="Search villas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Max price (AED)"
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>
          Search
        </button>
      </div>

      <div style={gridStyle}>
        {filteredVillas.map((villa) => (
          <div key={villa.id} style={cardStyle}>
            <img
              src={villa.images[0]}
              alt={villa.name}
              style={imageStyle}
            />
            <div style={cardContentStyle}>
              <h3 style={villaNameStyle}>{villa.name}</h3>
              <p style={locationStyle}>{villa.location}</p>
              <p style={descriptionStyle}>{villa.description}</p>
              
              <div style={amenitiesStyle}>
                {villa.amenities.slice(0, 4).map((amenity, index) => (
                  <span key={index} style={amenityTagStyle}>
                    {amenity}
                  </span>
                ))}
                {villa.amenities.length > 4 && (
                  <span style={amenityTagStyle}>
                    +{villa.amenities.length - 4} more
                  </span>
                )}
              </div>

              <div style={priceInfoStyle}>
                <div style={priceStyle}>
                  From AED {villa.pricing.weekday}/night
                </div>
                <div style={capacityStyle}>
                  Up to {villa.maxVisitors} guests
                </div>
              </div>

              <div style={actionsStyle}>
                <button
                  onClick={() => handleViewDetails(villa.id)}
                  style={secondaryButtonStyle}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleBookVilla(villa.id)}
                  style={primaryButtonStyle}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVillas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No villas found matching your criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default ListingsPage;