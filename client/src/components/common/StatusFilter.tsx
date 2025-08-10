import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, Cross1Icon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';

export interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface StatusFilterProps {
  value?: string;
  onChange: (value?: string) => void;
  options: StatusOption[];
  placeholder?: string;
  disabled?: boolean;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select status",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue?: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: '160px',
  };

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: selectedOption ? '#1a1a1a' : '#6b7280',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    minWidth: '160px',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 10px 38px rgba(0, 0, 0, 0.25)',
    zIndex: 50,
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
  };

  const optionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #f3f4f6',
  };

  const statusBadgeStyle = (color: string): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
  });

  const chevronStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
  };

  if (disabled) {
    return (
      <div style={containerStyle}>
        <div style={triggerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedOption && (
              <div style={statusBadgeStyle(selectedOption.color)} />
            )}
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
          </div>
          <ChevronDownIcon style={{ ...chevronStyle, color: '#9ca3af' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <motion.div
        style={triggerStyle}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ borderColor: colors.primary }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedOption && (
            <div style={statusBadgeStyle(selectedOption.color)} />
          )}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(undefined);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
              }}
            >
              <Cross1Icon style={{ width: '12px', height: '12px' }} />
            </button>
          )}
          <ChevronDownIcon style={chevronStyle} />
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={dropdownStyle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* All option */}
            <motion.div
              style={optionStyle}
              onClick={() => handleSelect(undefined)}
              whileHover={{ backgroundColor: '#f9fafb' }}
            >
              <div style={statusBadgeStyle('#d1d5db')} />
              <span>All Statuses</span>
            </motion.div>

            {/* Status options */}
            {options.map((option) => (
              <motion.div
                key={option.value}
                style={optionStyle}
                onClick={() => handleSelect(option.value)}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div style={statusBadgeStyle(option.color)} />
                <span>{option.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StatusFilter;