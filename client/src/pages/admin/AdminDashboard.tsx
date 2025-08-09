import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {BarChartIcon, GearIcon, HomeIcon, PersonIcon} from '@radix-ui/react-icons';
import {colors} from '../../utils/colors';
import {useUsers} from '../../contexts/UserContext';
import { getAssetUrl } from '../../utils/basePath';
import { VillaService, BookingService, PromotionService } from '../../services';
import type { Villa, Booking, Promotion } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [villasData, bookingsData, promotionsData] = await Promise.all([
          VillaService.getVillas(),
          BookingService.getBookings(),
          PromotionService.getPromotions()
        ]);
        setVillas(villasData);
        setBookings(bookingsData);
        setPromotions(promotionsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, []);
  
  const totalVillas = villas.length;
  const activeVillas = villas.filter(villa => villa.isActive).length;
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);
  const totalUsers = users.length;

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  };

  const configButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
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

  const actionButtonStyle: React.CSSProperties = {
    fontSize: '14px',
    color: colors.primary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  };

  const promotionCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  };

  const promotionImageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };

  const promotionContentStyle: React.CSSProperties = {
    padding: '16px',
  };

  const promotionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
  };

  const promotionDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
  };

  const activePromotion = promotions.find(p => p.isActive) || promotions[0];
  
  const promotionStatusStyle: React.CSSProperties = {
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
    backgroundColor: activePromotion?.isActive ? '#DCFCE7' : '#FEE2E2',
    color: activePromotion?.isActive ? '#166534' : '#DC2626',
    display: 'inline-block',
  };

  const quickActionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  };

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
      <div style={headerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <motion.button
          style={configButtonStyle}
          whileHover={{ backgroundColor: colors.primaryHover }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/config')}
        >
          <GearIcon style={{ width: '16px', height: '16px' }} />
          App Config
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/villas')}
        >
          <div style={statIconStyle}>
            <HomeIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Properties</p>
            <p style={statValueStyle}>{totalVillas}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/villas')}
        >
          <div style={statIconStyle}>
            <HomeIcon style={{ width: '24px', height: '24px', color: '#10B981' }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Active Properties</p>
            <p style={statValueStyle}>{activeVillas}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/users')}
        >
          <div style={statIconStyle}>
            <PersonIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Users</p>
            <p style={statValueStyle}>{totalUsers}</p>
          </div>
        </motion.div>

        <motion.div
          style={statCardStyle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/reports')}
        >
          <div style={statIconStyle}>
            <BarChartIcon style={{ width: '24px', height: '24px', color: colors.primary }} />
          </div>
          <div style={statContentStyle}>
            <p style={statLabelStyle}>Total Revenue</p>
            <p style={statValueStyle}>AED {totalRevenue.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>

      {/* Hero Banner Management */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Hero Banner</span>
          <button style={actionButtonStyle} onClick={() => navigate('/admin/promotions')}>
            Edit Banner
          </button>
        </div>
        {activePromotion ? (
          <motion.div
            style={promotionCardStyle}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/admin/promotions')}
          >
            <img
              src={activePromotion.imageUrl}
              alt={activePromotion.title}
              style={promotionImageStyle}
            />
            <div style={promotionContentStyle}>
              <h3 style={promotionTitleStyle}>{activePromotion.title}</h3>
              <p style={promotionDescriptionStyle}>{activePromotion.description}</p>
              <span style={promotionStatusStyle}>
                {activePromotion.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ) : (
          <div style={promotionCardStyle}>
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>No active promotions</p>
          </div>
        )}
      </section>

      {/* Featured Villas Management */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Featured Villas</span>
          <button style={actionButtonStyle} onClick={() => navigate('/admin/featured-villas')}>
            Manage Featured
          </button>
        </div>
        <div style={quickActionsGridStyle}>
          {villas.filter(villa => villa.isFeatured).map((villa) => (
            <motion.div
              key={villa.id}
              style={quickActionStyle}
              whileHover={{ 
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/properties/${villa.id}`)}
            >
              <img
                src={getAssetUrl(villa.images[0])}
                alt={villa.name}
                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
              />
              <p style={quickActionLabelStyle}>{villa.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={sectionStyle}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Quick Actions</h2>
        <div style={quickActionsGridStyle}>
          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/users')}
          >
            <PersonIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>Manage Users</p>
          </motion.div>

          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/properties')}
          >
            <HomeIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>Manage Properties</p>
          </motion.div>

          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/reports')}
          >
            <BarChartIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>View Reports</p>
          </motion.div>

          <motion.div
            style={quickActionStyle}
            whileHover={{ 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/config')}
          >
            <GearIcon style={quickActionIconStyle} />
            <p style={quickActionLabelStyle}>App Settings</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default AdminDashboard;