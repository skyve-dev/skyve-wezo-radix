import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockVillas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../utils/colors';
import BookingCalendar from '../../components/common/BookingCalendar';

const VillaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  
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
    if (selectedStartDate && selectedEndDate) {
      const searchParams = new URLSearchParams({
        villa: villa.id,
        checkIn: selectedStartDate.toISOString(),
        checkOut: selectedEndDate.toISOString()
      });
      navigate(`/bookings/new?${searchParams.toString()}`);
    }
  };

  const handleDateRangeSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  // Get price for a specific date with custom pricing priority
  const getPriceForDate = (date: Date) => {
    // Format date as ISO string (YYYY-MM-DD) for comparison
    const dateStr = date.toISOString().split('T')[0];
    
    // First, check if there's a custom price for this specific date
    const customPrice = villa.customPricing?.find(cp => cp.date === dateStr);
    if (customPrice) {
      return customPrice.price;
    }
    
    // If no custom price, fall back to standard pricing logic
    const dayOfWeek = date.getDay();
    // Weekend is Friday (5) and Saturday (6) in UAE
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return villa.pricing.weekend;
    }
    return villa.pricing.weekday;
  };

  // Calculate total price using custom pricing logic
  const calculateTotalPrice = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    
    let total = 0;
    const currentDate = new Date(selectedStartDate);
    
    while (currentDate < selectedEndDate) {
      total += getPriceForDate(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return total;
  };

  // Mock unavailable dates (for demo)
  const unavailableDates = [
    new Date(2025, 0, 15),
    new Date(2025, 0, 16),
    new Date(2025, 0, 17),
    new Date(2025, 0, 25),
    new Date(2025, 0, 26),
  ];

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
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
  };

  const twoColumnLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
    gap: '40px',
    marginTop: '40px',
  };

  const leftColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const rightColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const bookingSummaryStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const summaryTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a',
  };

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#4b5563',
  };

  const totalRowStyle: React.CSSProperties = {
    ...summaryRowStyle,
    fontWeight: '600',
    fontSize: '16px',
    color: '#1a1a1a',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px',
    marginTop: '12px',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a',
  };

  const nights = selectedStartDate && selectedEndDate
    ? Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPrice = calculateTotalPrice();
  const averagePricePerNight = nights > 0 ? Math.round(totalPrice / nights) : 0;

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
          Weekday: AED {villa.pricing.weekday}/night • Weekend: AED {villa.pricing.weekend}/night
        </div>

        <div style={amenitiesStyle}>
          {villa.amenities.map((amenity, index) => (
            <span key={index} style={amenityTagStyle}>
              {amenity}
            </span>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={twoColumnLayoutStyle}>
          {/* Left Column - Calendar */}
          <div style={leftColumnStyle}>
            <h3 style={sectionTitleStyle}>Select Dates</h3>
            <BookingCalendar
              pricing={villa.pricing}
              customPricing={villa.customPricing}
              unavailableDates={unavailableDates}
              onDateRangeSelect={handleDateRangeSelect}
            />
          </div>

          {/* Right Column - Booking Summary */}
          <div style={rightColumnStyle}>
            <div style={bookingSummaryStyle}>
              <h3 style={summaryTitleStyle}>Booking Summary</h3>
              
              {selectedStartDate && selectedEndDate ? (
                <>
                  <div style={summaryRowStyle}>
                    <span>Check-in</span>
                    <span>{selectedStartDate.toLocaleDateString()}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>Check-out</span>
                    <span>{selectedEndDate.toLocaleDateString()}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>Number of nights</span>
                    <span>{nights}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>Average per night</span>
                    <span>AED {averagePricePerNight}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>Maximum guests</span>
                    <span>{villa.maxVisitors} guests</span>
                  </div>
                  <div style={totalRowStyle}>
                    <span>Total Price</span>
                    <span>AED {totalPrice}</span>
                  </div>
                </>
              ) : (
                <div style={{ ...summaryRowStyle, justifyContent: 'center', color: '#9ca3af' }}>
                  Select dates to see pricing
                </div>
              )}
            </div>

            <motion.button
              style={selectedStartDate && selectedEndDate ? buttonStyle : disabledButtonStyle}
              onClick={handleBookNow}
              disabled={!selectedStartDate || !selectedEndDate}
              whileHover={selectedStartDate && selectedEndDate ? { backgroundColor: colors.primaryHover } : {}}
              whileTap={selectedStartDate && selectedEndDate ? { scale: 0.98 } : {}}
            >
              {!isAuthenticated 
                ? 'Sign In to Book' 
                : selectedStartDate && selectedEndDate 
                  ? 'Proceed to Booking' 
                  : 'Select Dates'}
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VillaDetailsPage;