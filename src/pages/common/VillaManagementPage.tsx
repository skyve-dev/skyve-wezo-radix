import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useAmenities } from '../../contexts/AmenitiesContext';
import { colors } from '../../utils/colors';
import type { Villa, VillaAmenities, User } from '../../types';

// Mock users for admin selection (in a real app, this would come from an API)
const mockUsers: User[] = [
  { id: 'user-1', email: 'john@example.com', name: 'John Smith', role: 'homeowner', isActive: true },
  { id: 'user-2', email: 'jane@example.com', name: 'Jane Doe', role: 'homeowner', isActive: true },
  { id: 'user-3', email: 'mike@example.com', name: 'Mike Johnson', role: 'homeowner', isActive: true },
];

const VillaManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { amenities } = useAmenities();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Villa>>({
    name: '',
    description: '',
    location: '',
    ownerId: user?.role === 'homeowner' ? user.id : '',
    maxVisitors: 1,
    numberOfBedrooms: 1,
    numberOfBeds: 1,
    numberOfBathrooms: 1,
    pricing: {
      weekday: 0,
      weekend: 0,
      halfDay: 0,
    },
    amenities: {
      generalComfort: [],
      outdoorRecreation: [],
      kitchenDining: [],
      technologyEntertainment: [],
      specialFeatures: [],
    },
    houseRules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      petsAllowed: false,
      partiesAllowed: false,
      commercialPhotographyAllowed: false,
      smokingAllowed: false,
      quietHours: '',
      poolRules: '',
      cleaningFee: '',
    },
    isActive: true,
    isFeatured: false,
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    amenities: false,
    pricing: false,
    houseRules: false,
    images: false,
  });

  // Check if user has permission to access this page
  useEffect(() => {
    if (!user || (user.role !== 'homeowner' && user.role !== 'admin')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Helper function to get display name for amenity categories
  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: { [key: string]: string } = {
      generalComfort: 'General Comfort',
      outdoorRecreation: 'Outdoor & Recreation',
      kitchenDining: 'Kitchen & Dining',
      technologyEntertainment: 'Technology & Entertainment',
      specialFeatures: 'Special Features'
    };
    return categoryNames[category] || category;
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle nested object changes (pricing, houseRules)
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Villa] as Record<string, any>),
        [field]: value
      }
    }));
  };

  // Handle amenity selection
  const handleAmenityToggle = (category: keyof VillaAmenities, amenity: string) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities?.[category] || [];
      const isSelected = currentAmenities.includes(amenity);
      
      return {
        ...prev,
        amenities: {
          ...prev.amenities,
          [category]: isSelected
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity]
        }
      };
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Villa name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (user?.role === 'admin' && !formData.ownerId) {
      newErrors.ownerId = 'Please select an owner';
    }

    if (!formData.maxVisitors || formData.maxVisitors < 1) {
      newErrors.maxVisitors = 'Max visitors must be at least 1';
    }

    if (!formData.numberOfBedrooms || formData.numberOfBedrooms < 1) {
      newErrors.numberOfBedrooms = 'Number of bedrooms must be at least 1';
    }

    if (!formData.numberOfBeds || formData.numberOfBeds < 1) {
      newErrors.numberOfBeds = 'Number of beds must be at least 1';
    }

    if (!formData.numberOfBathrooms || formData.numberOfBathrooms < 1) {
      newErrors.numberOfBathrooms = 'Number of bathrooms must be at least 1';
    }

    if (!formData.pricing?.weekday || formData.pricing.weekday < 0) {
      newErrors.weekdayPrice = 'Weekday price must be greater than 0';
    }

    if (!formData.pricing?.weekend || formData.pricing.weekend < 0) {
      newErrors.weekendPrice = 'Weekend price must be greater than 0';
    }

    if (!formData.pricing?.halfDay || formData.pricing.halfDay < 0) {
      newErrors.halfDayPrice = 'Half day price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be an API call to create the villa
      console.log('Villa data to submit:', formData);
      
      // Redirect to villa management list or dashboard
      navigate('/villa-management');
    } catch (error) {
      console.error('Error creating villa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const sectionContentStyle: React.CSSProperties = {
    padding: '20px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  };

  const formGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fff',
    outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px',
  };

  const amenityGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px',
    marginBottom: '16px',
  };

  const amenityItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const amenitySelectedStyle: React.CSSProperties = {
    ...amenityItemStyle,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: 'white',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  };

  const checkboxStyle: React.CSSProperties = {
    marginRight: '8px',
  };

  if (!user || (user.role !== 'homeowner' && user.role !== 'admin')) {
    return null;
  }

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={headerStyle}>
        <h1 style={titleStyle}>Register New Villa</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div style={sectionStyle}>
          <div 
            style={sectionHeaderStyle}
            onClick={() => toggleSection('basic')}
          >
            <h2 style={sectionTitleStyle}>Basic Information</h2>
            <span>{expandedSections.basic ? '−' : '+'}</span>
          </div>
          {expandedSections.basic && (
            <div style={sectionContentStyle}>
              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Villa Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={inputStyle}
                    placeholder="Enter villa name"
                  />
                  {errors.name && <span style={errorStyle}>{errors.name}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Location *</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    style={inputStyle}
                    placeholder="Enter location"
                  />
                  {errors.location && <span style={errorStyle}>{errors.location}</span>}
                </div>

                {user.role === 'admin' && (
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Owner *</label>
                    <select
                      value={formData.ownerId || ''}
                      onChange={(e) => handleInputChange('ownerId', e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Select an owner</option>
                      {mockUsers.map(mockUser => (
                        <option key={mockUser.id} value={mockUser.id}>
                          {mockUser.name} ({mockUser.email})
                        </option>
                      ))}
                    </select>
                    {errors.ownerId && <span style={errorStyle}>{errors.ownerId}</span>}
                  </div>
                )}
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  style={textareaStyle}
                  placeholder="Describe your villa..."
                />
                {errors.description && <span style={errorStyle}>{errors.description}</span>}
              </div>

              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Max Visitors *</label>
                  <input
                    type="number"
                    value={formData.maxVisitors || ''}
                    onChange={(e) => handleInputChange('maxVisitors', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="1"
                  />
                  {errors.maxVisitors && <span style={errorStyle}>{errors.maxVisitors}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Bedrooms *</label>
                  <input
                    type="number"
                    value={formData.numberOfBedrooms || ''}
                    onChange={(e) => handleInputChange('numberOfBedrooms', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="1"
                  />
                  {errors.numberOfBedrooms && <span style={errorStyle}>{errors.numberOfBedrooms}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Beds *</label>
                  <input
                    type="number"
                    value={formData.numberOfBeds || ''}
                    onChange={(e) => handleInputChange('numberOfBeds', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="1"
                  />
                  {errors.numberOfBeds && <span style={errorStyle}>{errors.numberOfBeds}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Bathrooms *</label>
                  <input
                    type="number"
                    value={formData.numberOfBathrooms || ''}
                    onChange={(e) => handleInputChange('numberOfBathrooms', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="1"
                  />
                  {errors.numberOfBathrooms && <span style={errorStyle}>{errors.numberOfBathrooms}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div style={sectionStyle}>
          <div 
            style={sectionHeaderStyle}
            onClick={() => toggleSection('pricing')}
          >
            <h2 style={sectionTitleStyle}>Pricing</h2>
            <span>{expandedSections.pricing ? '−' : '+'}</span>
          </div>
          {expandedSections.pricing && (
            <div style={sectionContentStyle}>
              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Weekday Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.pricing?.weekday || ''}
                    onChange={(e) => handleNestedChange('pricing', 'weekday', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="0"
                    placeholder="0"
                  />
                  {errors.weekdayPrice && <span style={errorStyle}>{errors.weekdayPrice}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Weekend Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.pricing?.weekend || ''}
                    onChange={(e) => handleNestedChange('pricing', 'weekend', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="0"
                    placeholder="0"
                  />
                  {errors.weekendPrice && <span style={errorStyle}>{errors.weekendPrice}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Half Day Price (AED) *</label>
                  <input
                    type="number"
                    value={formData.pricing?.halfDay || ''}
                    onChange={(e) => handleNestedChange('pricing', 'halfDay', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                    min="0"
                    placeholder="0"
                  />
                  {errors.halfDayPrice && <span style={errorStyle}>{errors.halfDayPrice}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Amenities Section */}
        <div style={sectionStyle}>
          <div 
            style={sectionHeaderStyle}
            onClick={() => toggleSection('amenities')}
          >
            <h2 style={sectionTitleStyle}>Amenities</h2>
            <span>{expandedSections.amenities ? '−' : '+'}</span>
          </div>
          {expandedSections.amenities && (
            <div style={sectionContentStyle}>
              {Object.entries(amenities).map(([category, categoryAmenities]) => (
                <div key={category} style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    {getCategoryDisplayName(category)}
                  </h3>
                  <div style={amenityGridStyle}>
                    {categoryAmenities.map((amenity: string) => {
                      const isSelected = formData.amenities?.[category as keyof VillaAmenities]?.includes(amenity) || false;
                      return (
                        <div
                          key={amenity}
                          style={isSelected ? amenitySelectedStyle : amenityItemStyle}
                          onClick={() => handleAmenityToggle(category as keyof VillaAmenities, amenity)}
                        >
                          {isSelected ? <CheckIcon width={16} height={16} /> : <div style={{ width: '16px', height: '16px' }} />}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* House Rules Section */}
        <div style={sectionStyle}>
          <div 
            style={sectionHeaderStyle}
            onClick={() => toggleSection('houseRules')}
          >
            <h2 style={sectionTitleStyle}>House Rules</h2>
            <span>{expandedSections.houseRules ? '−' : '+'}</span>
          </div>
          {expandedSections.houseRules && (
            <div style={sectionContentStyle}>
              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Check-in Time</label>
                  <input
                    type="time"
                    value={formData.houseRules?.checkInTime || '15:00'}
                    onChange={(e) => handleNestedChange('houseRules', 'checkInTime', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Check-out Time</label>
                  <input
                    type="time"
                    value={formData.houseRules?.checkOutTime || '11:00'}
                    onChange={(e) => handleNestedChange('houseRules', 'checkOutTime', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={formData.houseRules?.petsAllowed || false}
                      onChange={(e) => handleNestedChange('houseRules', 'petsAllowed', e.target.checked)}
                      style={checkboxStyle}
                    />
                    Pets Allowed
                  </label>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={formData.houseRules?.partiesAllowed || false}
                      onChange={(e) => handleNestedChange('houseRules', 'partiesAllowed', e.target.checked)}
                      style={checkboxStyle}
                    />
                    Parties/Events Allowed
                  </label>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={formData.houseRules?.commercialPhotographyAllowed || false}
                      onChange={(e) => handleNestedChange('houseRules', 'commercialPhotographyAllowed', e.target.checked)}
                      style={checkboxStyle}
                    />
                    Commercial Photography Allowed
                  </label>
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={formData.houseRules?.smokingAllowed || false}
                      onChange={(e) => handleNestedChange('houseRules', 'smokingAllowed', e.target.checked)}
                      style={checkboxStyle}
                    />
                    Smoking Allowed
                  </label>
                </div>
              </div>

              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Quiet Hours</label>
                  <input
                    type="text"
                    value={formData.houseRules?.quietHours || ''}
                    onChange={(e) => handleNestedChange('houseRules', 'quietHours', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., 10:00 PM - 8:00 AM"
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Pool Rules</label>
                  <input
                    type="text"
                    value={formData.houseRules?.poolRules || ''}
                    onChange={(e) => handleNestedChange('houseRules', 'poolRules', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., No glass containers"
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Cleaning Fee</label>
                  <input
                    type="text"
                    value={formData.houseRules?.cleaningFee || ''}
                    onChange={(e) => handleNestedChange('houseRules', 'cleaningFee', e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., AED 200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          style={isSubmitting ? buttonDisabledStyle : buttonStyle}
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { backgroundColor: colors.primaryHover } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? 'Creating Villa...' : 'Create Villa'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default VillaManagementPage;