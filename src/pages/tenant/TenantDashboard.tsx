import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {BellIcon, CalendarIcon, HomeIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {mockBookings, mockVillas} from '../../data/mockData';
import {colors} from '../../utils/colors';

const TenantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const userBookings = mockBookings.filter(booking => booking.tenantId === user?.id);
  const recentBookings = userBookings.slice(0, 3);

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

  const viewAllButtonStyle: React.CSSProperties = {
    fontSize: '14px',
    color: colors.primary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  };

  const bookingCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const bookingInfoStyle: React.CSSProperties = {
    flex: 1,
  };

  const bookingVillaStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px',
  };

  const bookingDateStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
  };

  const bookingStatusStyle = (status: string): React.CSSProperties => ({
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: '500',
    backgroundColor: status === 'confirmed' ? '#DCFCE7' : '#FEF3C7',
    color: status === 'confirmed' ? '#166534' : '#92400E',
  });

  const quickActionStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const quickActionIconStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    margin: '0 auto 8px',
    color: colors.primary,
  };

  const quickActionLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={welcomeStyle}>Welcome back, {user?.name}!</h1>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
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
            <p style={statLabelStyle}>Active Bookings</p>
            <p style={statValueStyle}>{userBookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div style={statIconStyle}>
            <HomeIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Bookings</p>
            <p style={statValueStyle}>{userBookings.length}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/notifications')}
        >
          <div style={statIconStyle}>
            <BellIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Notifications</p>
            <p style={statValueStyle}>2</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Recent Bookings</span>
          <button style={viewAllButtonStyle} onClick={() => navigate('/bookings')}>
            View All
          </button>
        </div>
        {recentBookings.map((booking) => {
          const villa = mockVillas.find(v => v.id === booking.villaId);
          return (
            <motion.div
              key={booking.id}
              style={bookingCardStyle}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div style={bookingInfoStyle}>
                <p style={bookingVillaStyle}>{villa?.name}</p>
                <p style={bookingDateStyle}>
                  {booking.checkInDate.toLocaleDateString()} - {booking.checkOutDate.toLocaleDateString()}
                </p>
              </div>
              <span style={bookingStatusStyle(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </motion.div>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section style={sectionStyle}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Quick Actions</h2>
        <div style={statsGridStyle}>
          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
          >
            <HomeIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>Browse Villas</p>
          </motion.div>

          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/bookings/new')}
          >
            <CalendarIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>New Booking</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TenantDashboard;