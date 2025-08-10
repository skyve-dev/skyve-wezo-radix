import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, Cross1Icon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';

interface BookingSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
}

const BookingSearchBar: React.FC<BookingSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search by email or booking ID...",
  disabled = false,
  debounceMs = 500
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: '280px',
    maxWidth: '400px',
    width: '100%',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px 10px 36px',
    fontSize: '14px',
    color: '#1a1a1a',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    width: '16px',
    height: '16px',
    color: '#9ca3af',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const clearButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    transition: 'all 0.2s',
  };

  const loadingIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    width: '14px',
    height: '14px',
    border: '2px solid #e5e7eb',
    borderTopColor: colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const isLoading = localValue !== value && localValue.length > 0;
  const showClear = localValue.length > 0 && !disabled;

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={inputWrapperStyle}>
        <MagnifyingGlassIcon style={searchIconStyle} />
        
        <motion.input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          whileFocus={{
            borderColor: colors.primary,
            boxShadow: `0 0 0 3px ${colors.primary}20`,
          }}
        />

        {isLoading && (
          <div style={loadingIndicatorStyle} />
        )}

        {showClear && !isLoading && (
          <motion.button
            style={clearButtonStyle}
            onClick={handleClear}
            whileHover={{ 
              backgroundColor: '#f3f4f6',
              color: '#6b7280' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Cross1Icon style={{ width: '12px', height: '12px' }} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BookingSearchBar;