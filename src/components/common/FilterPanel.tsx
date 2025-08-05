import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import { AnimatePresence, motion } from 'framer-motion';
import { Cross2Icon, TrashIcon, CheckIcon, ChevronDownIcon, CheckIcon as SelectedIcon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';
import type { VillaFilters } from '../../types/filters';
import { useAmenities } from '../../contexts/AmenitiesContext';
import { locations } from '../../data/data';
import { usePreventBodyScroll } from '../../hooks/useScrollbarWidth';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VillaFilters;
  onFiltersChange: (filters: VillaFilters) => void;
  onApplyFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<VillaFilters>({ ...filters });
  
  // Local state for price range slider
  const [priceRange, setPriceRange] = useState<[number, number]>([
    localFilters.priceRange.min || 0,
    localFilters.priceRange.max || 6000
  ]);

  // Get amenities from context
  const { amenities } = useAmenities();
  
  // State for location dropdown
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchValue, setLocationSearchValue] = useState(localFilters.location);
  
  // Prevent body scroll when panel is open
  usePreventBodyScroll(isOpen);

  const updateLocalFilters = (updates: Partial<VillaFilters>) => {
    setLocalFilters(prev => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: VillaFilters = {
      priceRange: { min: null, max: null },
      location: '',
      minBedrooms: null,
      minBathrooms: null,
      minGuests: null,
      amenities: {
        generalComfort: [],
        outdoorRecreation: [],
        kitchenDining: [],
        technologyEntertainment: [],
        specialFeatures: [],
      },
      searchTerm: '',
    };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 6000]);
    setLocationSearchValue('');
  };
  
  // Handle price range slider changes
  const handlePriceRangeChange = (value: number[]) => {
    const [min, max] = value;
    setPriceRange([min, max]);
    
    // Update local filters
    updateLocalFilters({
      priceRange: {
        min: min === 0 ? null : min,
        max: max === 6000 ? null : max,
      },
    });
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      generalComfort: 'General Comfort',
      outdoorRecreation: 'Outdoor & Recreation',
      kitchenDining: 'Kitchen & Dining',
      technologyEntertainment: 'Technology & Entertainment',
      specialFeatures: 'Special Features',
    };
    return categoryNames[category] || category;
  };

  const handleAmenityChange = (category: keyof VillaFilters['amenities'], amenity: string, checked: boolean) => {
    const currentAmenities = [...localFilters.amenities[category]];
    
    if (checked) {
      if (!currentAmenities.includes(amenity)) {
        currentAmenities.push(amenity);
      }
    } else {
      const index = currentAmenities.indexOf(amenity);
      if (index > -1) {
        currentAmenities.splice(index, 1);
      }
    }

    updateLocalFilters({
      amenities: {
        ...localFilters.amenities,
        [category]: currentAmenities,
      },
    });
  };

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  };

  const contentStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: window.innerWidth < 768 ? '100vw' : '400px',
    backgroundColor: 'white',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    zIndex: 101,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const scrollContentStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px',
    paddingBottom: '100px', // Space for footer
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
  };

  const priceSliderContainerStyle: React.CSSProperties = {
    padding: '20px 0',
  };
  
  const priceDisplayStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    fontSize: window.innerWidth < 768 ? '13px' : '14px',
    fontWeight: '500',
    color: '#374151',
    gap: '12px',
  };
  
  const priceValueStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  };
  
  const sliderRootStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    touchAction: 'none',
    width: '100%',
    height: '20px',
  };
  
  const sliderTrackStyle: React.CSSProperties = {
    backgroundColor: '#e5e7eb',
    position: 'relative',
    flexGrow: 1,
    borderRadius: '9999px',
    height: '4px',
  };
  
  const sliderRangeStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderRadius: '9999px',
    height: '100%',
  };
  
  const sliderThumbStyle: React.CSSProperties = {
    display: 'block',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    border: `2px solid ${colors.primary}`,
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const numberSelectStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  };

  const numberButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: `1px solid ${isSelected ? colors.primary : '#d1d5db'}`,
    borderRadius: '20px',
    backgroundColor: isSelected ? colors.primary : 'white',
    color: isSelected ? 'white' : '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const amenityCategoryStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const amenityCategoryTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  };

  const checkboxGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '8px',
  };

  const checkboxItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '2px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  const footerStyle: React.CSSProperties = {
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
    display: 'flex',
    gap: '12px',
  };

  const buttonStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  };

  const clearButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const applyButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.primary,
    color: 'white',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} modal={false}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                style={overlayStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild onInteractOutside={onClose}>
              <motion.div
                style={contentStyle}
                initial={{ x: window.innerWidth < 768 ? '100%' : '400px' }}
                animate={{ x: 0 }}
                exit={{ x: window.innerWidth < 768 ? '100%' : '400px' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              >
                {/* Header */}
                <div style={headerStyle}>
                  <h2 style={titleStyle}>Filters</h2>
                  <button style={closeButtonStyle} onClick={onClose}>
                    <Cross2Icon style={{ width: '24px', height: '24px' }} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div style={scrollContentStyle}>
                  {/* Search Term */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Search</h3>
                    <input
                      type="text"
                      placeholder="Search villas by name or description..."
                      value={localFilters.searchTerm}
                      onChange={(e) => updateLocalFilters({ searchTerm: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  {/* Price Range Slider */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Price Range (AED per night)</h3>
                    <div style={priceSliderContainerStyle}>
                      {/* Price Display */}
                      <div style={priceDisplayStyle}>
                        <div style={priceValueStyle}>
                          Min: {priceRange[0]} AED
                        </div>
                        <div style={priceValueStyle}>
                          Max: {priceRange[1]} AED
                        </div>
                      </div>
                      
                      {/* Dual-thumb Slider */}
                      <Slider.Root
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={6000}
                        min={0}
                        step={50}
                        minStepsBetweenThumbs={1}
                        style={sliderRootStyle}
                      >
                        <Slider.Track style={sliderTrackStyle}>
                          <Slider.Range style={sliderRangeStyle} />
                        </Slider.Track>
                        <Slider.Thumb style={sliderThumbStyle} />
                        <Slider.Thumb style={sliderThumbStyle} />
                      </Slider.Root>
                    </div>
                  </div>

                  {/* Location */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Location</h3>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Select or enter location..."
                        value={locationSearchValue}
                        onChange={(e) => {
                          setLocationSearchValue(e.target.value);
                          updateLocalFilters({ location: e.target.value });
                        }}
                        onFocus={() => setIsLocationDropdownOpen(true)}
                        style={{
                          ...inputStyle,
                          paddingRight: '40px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ChevronDownIcon
                          style={{
                            transform: isLocationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </button>
                      
                      {isLocationDropdownOpen && (
                        <>
                          {/* Invisible overlay to close dropdown when clicking outside */}
                          <div
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 149,
                            }}
                            onClick={() => setIsLocationDropdownOpen(false)}
                          />
                          
                          {/* Dropdown content */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                              zIndex: 150,
                              maxHeight: '250px',
                              overflowY: 'auto',
                              marginBottom: '12px',
                            }}
                          >
                            {locations
                              .filter(location => location !== 'Unspecified')
                              .filter(location => 
                                location.toLowerCase().includes(locationSearchValue.toLowerCase())
                              )
                              .map((location) => (
                                <div
                                  key={location}
                                  onClick={() => {
                                    setLocationSearchValue(location);
                                    updateLocalFilters({ location });
                                    setIsLocationDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: '12px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'background-color 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                  }}
                                >
                                  <span>{location}</span>
                                  {localFilters.location === location && (
                                    <SelectedIcon width={14} height={14} style={{ color: colors.primary }} />
                                  )}
                                </div>
                              ))}
                            
                            {/* Show message if no locations match */}
                            {locations
                              .filter(location => location !== 'Unspecified')
                              .filter(location => 
                                location.toLowerCase().includes(locationSearchValue.toLowerCase())
                              ).length === 0 && locationSearchValue && (
                              <div
                                style={{
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  fontStyle: 'italic',
                                }}
                              >
                                No locations found. Continue typing to use "{locationSearchValue}" as a custom location.
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Minimum Bedrooms</h3>
                    <div style={numberSelectStyle}>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button
                          key={num}
                          style={numberButtonStyle(localFilters.minBedrooms === num)}
                          onClick={() => updateLocalFilters({
                            minBedrooms: localFilters.minBedrooms === num ? null : num,
                          })}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Minimum Bathrooms</h3>
                    <div style={numberSelectStyle}>
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          style={numberButtonStyle(localFilters.minBathrooms === num)}
                          onClick={() => updateLocalFilters({
                            minBathrooms: localFilters.minBathrooms === num ? null : num,
                          })}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Minimum Guests</h3>
                    <div style={numberSelectStyle}>
                      {[1, 2, 4, 6, 8, 10, 12, 15].map(num => (
                        <button
                          key={num}
                          style={numberButtonStyle(localFilters.minGuests === num)}
                          onClick={() => updateLocalFilters({
                            minGuests: localFilters.minGuests === num ? null : num,
                          })}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Amenities</h3>
                    {Object.entries(amenities).map(([category, categoryAmenities]) => (
                      <div key={category} style={amenityCategoryStyle}>
                        <h4 style={amenityCategoryTitleStyle}>
                          {getCategoryDisplayName(category)}
                        </h4>
                        <div style={checkboxGridStyle}>
                          {categoryAmenities.map((amenity: string) => {
                            const isChecked = localFilters.amenities[category as keyof VillaFilters['amenities']].includes(amenity);
                            return (
                              <div
                                key={amenity}
                                style={{
                                  ...checkboxItemStyle,
                                  backgroundColor: isChecked ? colors.primary + '10' : 'transparent',
                                }}
                                onClick={() => handleAmenityChange(
                                  category as keyof VillaFilters['amenities'],
                                  amenity,
                                  !isChecked
                                )}
                              >
                                <div
                                  style={{
                                    ...checkboxStyle,
                                    backgroundColor: isChecked ? colors.primary : 'transparent',
                                    borderColor: isChecked ? colors.primary : '#d1d5db',
                                  }}
                                >
                                  {isChecked && (
                                    <CheckIcon style={{ width: '12px', height: '12px', color: 'white' }} />
                                  )}
                                </div>
                                <span style={{ fontSize: '14px', color: '#374151' }}>
                                  {amenity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={footerStyle}>
                  <motion.button
                    style={clearButtonStyle}
                    onClick={handleClear}
                    whileHover={{ backgroundColor: '#e5e7eb' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TrashIcon style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    Clear All
                  </motion.button>
                  <motion.button
                    style={applyButtonStyle}
                    onClick={handleApply}
                    whileHover={{ backgroundColor: colors.primaryHover }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default FilterPanel;