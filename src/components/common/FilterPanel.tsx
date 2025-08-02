import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { Cross2Icon, TrashIcon, CheckIcon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';
import type { VillaFilters } from '../../types/filters';
import { mockVillas } from '../../data/mockData';

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

  // Get all unique amenities from villas for checkbox options
  const getAllAmenities = () => {
    const amenitiesByCategory: Record<string, Set<string>> = {
      generalComfort: new Set(),
      outdoorRecreation: new Set(),
      kitchenDining: new Set(),
      technologyEntertainment: new Set(),
      specialFeatures: new Set(),
    };

    mockVillas.forEach(villa => {
      Object.entries(villa.amenities).forEach(([category, items]) => {
        if (items && amenitiesByCategory[category]) {
          items.forEach((item: string) => amenitiesByCategory[category].add(item));
        }
      });
    });

    return Object.fromEntries(
      Object.entries(amenitiesByCategory).map(([category, items]) => [
        category,
        Array.from(items).sort()
      ])
    );
  };

  const allAmenities = getAllAmenities();

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

  const priceRangeStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
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
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
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
            <Dialog.Content asChild>
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

                  {/* Price Range */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Price Range (AED per night)</h3>
                    <div style={priceRangeStyle}>
                      <input
                        type="number"
                        placeholder="Min price"
                        value={localFilters.priceRange.min || ''}
                        onChange={(e) => updateLocalFilters({
                          priceRange: {
                            ...localFilters.priceRange,
                            min: e.target.value ? parseInt(e.target.value) : null,
                          },
                        })}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="Max price"
                        value={localFilters.priceRange.max || ''}
                        onChange={(e) => updateLocalFilters({
                          priceRange: {
                            ...localFilters.priceRange,
                            max: e.target.value ? parseInt(e.target.value) : null,
                          },
                        })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Location</h3>
                    <input
                      type="text"
                      placeholder="Search by location..."
                      value={localFilters.location}
                      onChange={(e) => updateLocalFilters({ location: e.target.value })}
                      style={inputStyle}
                    />
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
                    {Object.entries(allAmenities).map(([category, amenities]) => (
                      <div key={category} style={amenityCategoryStyle}>
                        <h4 style={amenityCategoryTitleStyle}>
                          {getCategoryDisplayName(category)}
                        </h4>
                        <div style={checkboxGridStyle}>
                          {amenities.map(amenity => {
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