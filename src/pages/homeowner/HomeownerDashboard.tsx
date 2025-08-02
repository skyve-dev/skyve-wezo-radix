import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {CalendarIcon, HomeIcon, PersonIcon, PlusIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {mockBookings, mockVillas} from '../../data/mockData';

const HomeownerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const ownerVillas = mockVillas.filter(villa => villa.ownerId === user?.id);
  const ownerBookings = mockBookings.filter(booking => 
    ownerVillas.some(villa => villa.id === booking.villaId)
  );

  const totalRevenue = ownerBookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

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
    backgroundColor: '#EEF2FF',
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
    backgroundColor: '#4F46E5',
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
  };

  const villaImageStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
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
            <HomeIcon style={{ width: '24px', height: '24px', color: '#4F46E5' }} />
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
            <CalendarIcon style={{ width: '24px', height: '24px', color: '#4F46E5' }} />
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
            <PersonIcon style={{ width: '24px', height: '24px', color: '#4F46E5' }} />
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
            <CalendarIcon style={{ width: '24px', height: '24px', color: '#4F46E5' }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>This Month</p>
            <p style={statValueStyle}>{ownerBookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
        </motion.div>
      </div>

      {/* My Villas */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>My Villas</span>
          <motion.button
            style={addButtonStyle}
            whileHover={{ backgroundColor: '#4338CA' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/villas/add')}
          >
            <PlusIcon style={{ width: '16px', height: '16px' }} />
            Add Villa
          </motion.button>
        </div>
        <div style={villaGridStyle}>
          {ownerVillas.slice(0, 4).map((villa) => (
            <motion.div
              key={villa.id}
              style={villaCardStyle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/villas/${villa.id}/manage`)}
            >
              <img
                src={villa.images[0]}
                alt={villa.name}
                style={villaImageStyle}
              />
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
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Bookings */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Recent Bookings</span>
          <button style={{ ...addButtonStyle, backgroundColor: 'transparent', color: '#4F46E5' }} onClick={() => navigate('/bookings')}>
            View All
          </button>
        </div>
        <div style={recentBookingsStyle}>
          {ownerBookings.slice(0, 5).map((booking, index) => {
            const villa = ownerVillas.find(v => v.id === booking.villaId);
            return (
              <div key={booking.id} style={bookingItemStyle}>
                <div style={bookingInfoStyle}>
                  <p style={bookingVillaStyle}>{villa?.name}</p>
                  <p style={bookingDateStyle}>
                    {booking.checkInDate.toLocaleDateString()} - {booking.checkOutDate.toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                    AED {booking.totalPrice}
                  </p>
                  <span style={statusBadgeStyle(booking.status === 'confirmed')}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default HomeownerDashboard;