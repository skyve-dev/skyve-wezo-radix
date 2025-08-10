import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  placeholder = "Select date range",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDisplayText = (): string => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    } else if (value.startDate) {
      return `From ${formatDate(value.startDate)}`;
    } else if (value.endDate) {
      return `Until ${formatDate(value.endDate)}`;
    }
    return placeholder;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ ...value, startDate: date });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ ...value, endDate: date });
  };

  const clearDates = () => {
    onChange({ startDate: undefined, endDate: undefined });
    setIsOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    minWidth: '200px',
  };

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: (value.startDate || value.endDate) ? '#1a1a1a' : '#6b7280',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    minWidth: '200px',
    justifyContent: 'space-between',
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
    padding: '16px',
    marginTop: '4px',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '4px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing : 'border-box'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const clearButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
  };

  const applyButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: 'white',
    backgroundColor: colors.primary,
  };

  const formatDateForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  if (disabled) {
    return (
      <div style={containerStyle}>
        <div style={triggerStyle}>
          <CalendarIcon style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
          <span>{getDisplayText()}</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <CalendarIcon style={{ width: '16px', height: '16px' }} />
          <span>{getDisplayText()}</span>
        </div>
        {(value.startDate || value.endDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearDates();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: '18px',
              lineHeight: '1',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        )}
      </motion.div>

      {isOpen && (
        <motion.div
          style={dropdownStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Start Date</label>
            <input
              type="date"
              value={formatDateForInput(value.startDate)}
              onChange={handleStartDateChange}
              style={inputStyle}
              max={formatDateForInput(value.endDate)}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>End Date</label>
            <input
              type="date"
              value={formatDateForInput(value.endDate)}
              onChange={handleEndDateChange}
              style={inputStyle}
              min={formatDateForInput(value.startDate)}
            />
          </div>

          <div style={actionsStyle}>
            <motion.button
              style={clearButtonStyle}
              onClick={clearDates}
              whileHover={{ backgroundColor: '#e5e7eb' }}
              whileTap={{ scale: 0.98 }}
            >
              Clear
            </motion.button>
            <motion.button
              style={applyButtonStyle}
              onClick={() => setIsOpen(false)}
              whileHover={{ backgroundColor: colors.primaryHover }}
              whileTap={{ scale: 0.98 }}
            >
              Apply
            </motion.button>
          </div>
        </motion.div>
      )}

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

export default DateRangeFilter;