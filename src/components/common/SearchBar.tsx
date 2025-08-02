import React from 'react';
import { MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { colors } from '../../utils/colors';
import type { VillaFilters, FilterSummary } from '../../types/filters';

interface SearchBarProps {
  filters: VillaFilters;
  onOpenFilters: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onOpenFilters, className }) => {
  // Generate filter summary for display
  const getFilterSummary = (): FilterSummary => {
    const summary: FilterSummary = {};
    
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      const min = filters.priceRange.min || 0;
      const max = filters.priceRange.max || '∞';
      summary.priceRange = `AED ${min} - ${max}`;
    }
    
    if (filters.location.trim()) {
      summary.location = filters.location;
    }
    
    if (filters.minBedrooms !== null) {
      summary.bedrooms = `${filters.minBedrooms}+ beds`;
    }
    
    if (filters.minBathrooms !== null) {
      summary.bathrooms = `${filters.minBathrooms}+ baths`;
    }
    
    if (filters.minGuests !== null) {
      summary.guests = `${filters.minGuests}+ guests`;
    }
    
    if (filters.searchTerm.trim()) {
      summary.searchTerm = filters.searchTerm;
    }
    
    // Count selected amenities
    const totalAmenities = Object.values(filters.amenities).flat().length;
    if (totalAmenities > 0) {
      summary.amenitiesCount = totalAmenities;
    }
    
    return summary;
  };

  const summary = getFilterSummary();
  const hasActiveFilters = Object.keys(summary).length > 0;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto 24px',
  };

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'white',
    border: `2px solid ${hasActiveFilters ? colors.primary : '#e5e7eb'}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minHeight: '56px',
    boxSizing: 'border-box',
  };

  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: '#6b7280',
    marginRight: '12px',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  };

  const placeholderStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#9ca3af',
    fontWeight: '400',
  };

  const summaryStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  };

  const tagsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  };

  const tagStyle: React.CSSProperties = {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: colors.primary + '20',
    color: colors.primary,
    borderRadius: '6px',
    fontWeight: '500',
  };

  const filterButtonStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: hasActiveFilters ? colors.primary : '#f3f4f6',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '12px',
    flexShrink: 0,
  };

  const filterIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: hasActiveFilters ? 'white' : '#6b7280',
  };

  const renderSummaryTags = () => {
    const tags: string[] = [];
    
    if (summary.searchTerm) tags.push(`"${summary.searchTerm}"`);
    if (summary.location) tags.push(summary.location);
    if (summary.priceRange) tags.push(summary.priceRange);
    if (summary.bedrooms) tags.push(summary.bedrooms);
    if (summary.bathrooms) tags.push(summary.bathrooms);
    if (summary.guests) tags.push(summary.guests);
    if (summary.amenitiesCount) tags.push(`${summary.amenitiesCount} amenities`);

    return tags.map((tag, index) => (
      <span key={index} style={tagStyle}>
        {tag}
      </span>
    ));
  };

  return (
    <div style={containerStyle} className={className}>
      <motion.div
        style={searchBarStyle}
        onClick={onOpenFilters}
        whileHover={{ 
          borderColor: colors.primary,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <MagnifyingGlassIcon style={iconStyle} />
        
        <div style={contentStyle}>
          {!hasActiveFilters ? (
            <span style={placeholderStyle}>
              Search by location, price, amenities and more...
            </span>
          ) : (
            <>
              <span style={summaryStyle}>
                {Object.keys(summary).length} filter{Object.keys(summary).length > 1 ? 's' : ''} applied
              </span>
              <div style={tagsStyle}>
                {renderSummaryTags()}
              </div>
            </>
          )}
        </div>

        <motion.button
          style={filterButtonStyle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenFilters();
          }}
        >
          <MixerHorizontalIcon style={filterIconStyle} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SearchBar;