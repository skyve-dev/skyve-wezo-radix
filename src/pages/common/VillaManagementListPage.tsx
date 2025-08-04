import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {EyeClosedIcon, EyeOpenIcon, Pencil1Icon, PlusIcon, CheckIcon, ChevronDownIcon} from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import {useAuth} from '../../contexts/AuthContext';
import {useVillas} from '../../contexts/VillasContext';
import {colors} from '../../utils/colors';

const VillaManagementListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { villas, updateVilla } = useVillas();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');

  // Check if user has permission to access this page
  if (!user || (user.role !== 'homeowner' && user.role !== 'admin')) {
    navigate('/dashboard');
    return null;
  }

  // Filter villas based on user role
  const userVillas = user.role === 'admin' 
    ? villas 
    : villas.filter(villa => villa.ownerId === user.id);

  // Apply filters
  const filteredVillas = userVillas.filter(villa => {
    const matchesSearch = villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         villa.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && villa.isActive) ||
                         (statusFilter === 'inactive' && !villa.isActive);
    
    const matchesFeatured = featuredFilter === 'all' ||
                           (featuredFilter === 'featured' && villa.isFeatured) ||
                           (featuredFilter === 'not-featured' && !villa.isFeatured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  // Toggle villa active status
  const toggleVillaStatus = (villaId: string, currentStatus: boolean) => {
    updateVilla(villaId, { isActive: !currentStatus });
  };

  // Toggle featured status (admin only)
  const toggleFeaturedStatus = (villaId: string, currentStatus: boolean) => {
    if (user.role === 'admin') {
      updateVilla(villaId, { isFeatured: !currentStatus });
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin : 0,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const searchInputStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    outline: 'none',
    minWidth: '200px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    outline: 'none',
    cursor: 'pointer',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };


  const cardContentStyle: React.CSSProperties = {
    padding: '16px',
  };

  const villaNameStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin:'0px',
  };

  const villaLocationStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    margin : '0px',
    marginBottom:'8px'
  };

  const statusRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };

  const statusBadgeStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '12px',
    textTransform: 'uppercase',
  };

  const activeStatusStyle: React.CSSProperties = {
    ...statusBadgeStyle,
    backgroundColor: '#dcfce7',
    color: '#166534',
  };

  const inactiveStatusStyle: React.CSSProperties = {
    ...statusBadgeStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  };

  const featuredBadgeStyle: React.CSSProperties = {
    ...statusBadgeStyle,
    backgroundColor: '#fef3c7',
    color: '#92400e',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.primary,
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const successButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: 'white',
  };

  const warningButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f59e0b',
    color: 'white',
  };

  const addButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={headerStyle}>
        <h1 style={titleStyle}>Villa Management</h1>
        <motion.button
          style={addButtonStyle}
          onClick={() => navigate('/villas/add')}
          whileHover={{ backgroundColor: colors.primaryHover }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon width={16} height={16} />
          Add New Villa
        </motion.button>
      </div>

      {/* Filters */}
      <div style={filtersStyle}>
        <input
          type="text"
          placeholder="Search villas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        
        <Select.Root value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <Select.Trigger
            style={{
              ...selectStyle,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              minWidth: '150px',
            }}
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
                zIndex: 1000,
              }}
            >
              <Select.Viewport>
                <Select.Item
                  value="all"
                  style={{
                    fontSize: '14px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Select.ItemText>All Status</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item
                  value="active"
                  style={{
                    fontSize: '14px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Select.ItemText>Active</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item
                  value="inactive"
                  style={{
                    fontSize: '14px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Select.ItemText>Inactive</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {user.role === 'admin' && (
          <Select.Root value={featuredFilter} onValueChange={(value: any) => setFeaturedFilter(value)}>
            <Select.Trigger
              style={{
                ...selectStyle,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                minWidth: '150px',
              }}
            >
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '8px',
                  boxShadow: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
                  zIndex: 1000,
                }}
              >
                <Select.Viewport>
                  <Select.Item
                    value="all"
                    style={{
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Select.ItemText>All Featured</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="featured"
                    style={{
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Select.ItemText>Featured</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="not-featured"
                    style={{
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Select.ItemText>Not Featured</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      </div>

      {/* Villa Grid */}
      {filteredVillas.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No villas found</h3>
          <p>
            {userVillas.length === 0 
              ? "You haven't registered any villas yet. Click 'Add New Villa' to get started."
              : "No villas match your current filters."}
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredVillas.map((villa) => (
            <motion.div
              key={villa.id}
              style={cardStyle}
              whileHover={{ 
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }}
              layout
            >
              <div style={{background:colors.gray200}}>
              <div style={{width:'100%',paddingTop:'80%',backgroundImage:`url(${villa.images[0]})`,backgroundPosition:'center',backgroundSize:'cover'}}></div>
              </div>
              <div style={cardContentStyle}>
                <h3 style={villaNameStyle}>{villa.name}</h3>
                <p style={villaLocationStyle}>{villa.location}</p>
                
                <div style={statusRowStyle}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={villa.isActive ? activeStatusStyle : inactiveStatusStyle}>
                      {villa.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {villa.isFeatured && (
                      <span style={featuredBadgeStyle}>Featured</span>
                    )}
                  </div>
                </div>

                <div style={actionsStyle}>
                  <motion.button
                    style={villa.isActive ? warningButtonStyle : successButtonStyle}
                    onClick={() => toggleVillaStatus(villa.id, villa.isActive)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {villa.isActive ? <EyeClosedIcon width={12} height={12} /> : <EyeOpenIcon width={12} height={12} />}
                    {villa.isActive ? 'Deactivate' : 'Activate'}
                  </motion.button>

                  {user.role === 'admin' && (
                    <motion.button
                      style={villa.isFeatured ? secondaryButtonStyle : primaryButtonStyle}
                      onClick={() => toggleFeaturedStatus(villa.id, villa.isFeatured)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {villa.isFeatured ? 'Unfeature' : 'Feature'}
                    </motion.button>
                  )}

                  <motion.button
                    style={secondaryButtonStyle}
                    onClick={() => navigate(`/villas/edit/${villa.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pencil1Icon width={12} height={12} />
                    Edit
                  </motion.button>

                  <motion.button
                    style={secondaryButtonStyle}
                    onClick={() => navigate(`/villas/${villa.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default VillaManagementListPage;