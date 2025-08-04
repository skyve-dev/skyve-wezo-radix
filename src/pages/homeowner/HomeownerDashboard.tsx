import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {CalendarIcon, HomeIcon, ReaderIcon, PlusIcon, TokensIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useVillas} from '../../contexts/VillasContext';
import {useBookings} from '../../contexts/BookingsContext';
import type { Booking } from '../../types';
import {colors} from '../../utils/colors';

const HomeownerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { villas, getVillaById } = useVillas();
  const { getBookingsByVilla } = useBookings();
  
  // Get villas owned by the current homeowner
  const ownerVillas = villas.filter(villa => villa.ownerId === user?.id);
  
  // Get all bookings for the homeowner's villas
  const ownerBookings = ownerVillas.reduce((allBookings, villa) => {
    const villaBookings = getBookingsByVilla(villa.id);
    return [...allBookings, ...villaBookings];
  }, [] as Booking[]);

  // Calculate total revenue from paid bookings
  const totalRevenue = ownerBookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  // Get this month's bookings
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const thisMonthBookings = ownerBookings.filter(booking => {
    const bookingDate = new Date(booking.checkInDate);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  });

  // Get recent 20 bookings, sorted by check-in date (most recent first)
  const recentBookings = ownerBookings
    .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
    .slice(0, 20);

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const welcomeStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '32px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
  };

  const statIconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: colors.primaryLight,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const statContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const addButtonStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'white',
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const villaGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  };

  const villaCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
    maxWidth : '420px',
  };


  const villaContentStyle: React.CSSProperties = {
    padding: '16px',
  };

  const villaNameStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px',
  };

  const villaLocationStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  };

  const villaStatsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#374151',
  };

  const statusBadgeStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '500',
    backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2',
    color: isActive ? '#166534' : '#DC2626',
  });

  const recentBookingsStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const bookingItemStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const bookingInfoStyle: React.CSSProperties = {
    flex: 1,
  };

  const bookingVillaStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px',
  };

  const bookingDateStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={welcomeStyle}>Homeowner Dashboard</h1>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/my-villas')}
        >
          <div style={statIconStyle}>
            <HomeIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>My Villas</p>
            <p style={statValueStyle}>{ownerVillas.length}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/bookings')}
        >
          <div style={statIconStyle}>
            <CalendarIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Bookings</p>
            <p style={statValueStyle}>{ownerBookings.length}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div style={statIconStyle}>
            <TokensIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Revenue</p>
            <p style={statValueStyle}>AED {totalRevenue.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div style={statIconStyle}>
            <ReaderIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>This Month's Bookings</p>
            <p style={statValueStyle}>{thisMonthBookings.length}</p>
          </div>
        </motion.div>
      </div>

      {/* My Villas */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>My Villas ({ownerVillas.length})</span>
          <motion.button
            style={addButtonStyle}
            whileHover={{ backgroundColor: colors.primaryHover }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/villas/add')}
          >
            <PlusIcon style={{ width: '16px', height: '16px' }} />
            Add Villa
          </motion.button>
        </div>
        {ownerVillas.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <HomeIcon style={{ 
              width: '48px', 
              height: '48px', 
              color: '#9ca3af', 
              margin: '0 auto 16px' 
            }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1a1a1a', 
              marginBottom: '8px' 
            }}>
              No Villas Yet
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              marginBottom: '20px' 
            }}>
              Start your hosting journey by adding your first villa.
            </p>
            <motion.button
              style={addButtonStyle}
              whileHover={{ backgroundColor: colors.primaryHover }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/villas/add')}
            >
              <PlusIcon style={{ width: '16px', height: '16px' }} />
              Add Your First Villa
            </motion.button>
          </div>
        ) : (
          <>
            <div style={villaGridStyle}>
              {ownerVillas.slice(0, 6).map((villa) => {
                const villaBookings = getBookingsByVilla(villa.id);
                const villaRevenue = villaBookings
                  .filter(booking => booking.paymentStatus === 'paid')
                  .reduce((sum, booking) => sum + booking.totalPrice, 0);
                
                return (
                  <motion.div
                    key={villa.id}
                    style={villaCardStyle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/villas/${villa.id}/manage`)}
                  >
                    <div style={{backgroundColor:colors.gray200}}>
                      <div style={{width:'100%',paddingTop:'100%',backgroundImage:`url(${villa.images[0]})`,backgroundPosition:'center',backgroundSize:'cover'}}></div>
                    </div>

                    <div style={villaContentStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={villaNameStyle}>{villa.name}</p>
                          <p style={villaLocationStyle}>{villa.location}</p>
                        </div>
                        <span style={statusBadgeStyle(villa.isActive)}>
                          {villa.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div style={villaStatsStyle}>
                        <span>AED {villa.pricing.weekday}/day</span>
                        <span>Max {villa.maxVisitors} guests</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #f3f4f6',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <span>{villaBookings.length} booking{villaBookings.length !== 1 ? 's' : ''}</span>
                        <span>AED {villaRevenue.toLocaleString()} revenue</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {ownerVillas.length > 6 && (
              <div style={{ 
                padding: '16px', 
                textAlign: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Showing 6 of {ownerVillas.length} villas
                <button 
                  style={{ 
                    marginLeft: '8px',
                    color: colors.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => navigate('/villa-management')}
                >
                  View All
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Recent Bookings */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Recent Bookings ({recentBookings.length})</span>
          <button style={{ ...addButtonStyle, backgroundColor: 'transparent', color: colors.primary }} onClick={() => navigate('/bookings')}>
            View All
          </button>
        </div>
        <div style={recentBookingsStyle}>
          {recentBookings.length === 0 ? (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '14px' 
            }}>
              No bookings yet for your properties.
            </div>
          ) : (
            recentBookings.slice(0, 10).map((booking) => {
              const villa = getVillaById(booking.villaId);
              return (
                <motion.div 
                  key={booking.id} 
                  style={bookingItemStyle}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                >
                  <div style={bookingInfoStyle}>
                    <p style={bookingVillaStyle}>{villa?.name || 'Unknown Villa'}</p>
                    <p style={bookingDateStyle}>
                      {booking.checkInDate.toLocaleDateString()} - {booking.checkOutDate.toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                      Booking ID: {booking.id}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                      AED {booking.totalPrice.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                    </p>
                    <span style={statusBadgeStyle(booking.status === 'confirmed')}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        {recentBookings.length > 10 && (
          <div style={{ 
            padding: '16px', 
            textAlign: 'center', 
            backgroundColor: '#f9fafb',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Showing 10 of {recentBookings.length} recent bookings
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default HomeownerDashboard;