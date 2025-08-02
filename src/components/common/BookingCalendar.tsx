import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../utils/colors';

interface BookingCalendarProps {
  pricing: {
    weekday: number;
    weekend: number;
    halfDay: number;
  };
  unavailableDates?: Date[];
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
}

type ViewMode = 'month' | 'year' | 'decade';

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  pricing,
  unavailableDates = [],
  onDateRangeSelect
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Get the first day to display (including previous month's days)
  const startCalendarDate = new Date(firstDayOfMonth);
  startCalendarDate.setDate(startCalendarDate.getDate() - firstDayOfMonth.getDay());

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      unavailable.toDateString() === date.toDateString()
    );
  };

  // Check if a date is before today
  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Get price for a specific date
  const getPriceForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    // Weekend is Friday (5) and Saturday (6) in UAE
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return pricing.weekend;
    }
    return pricing.weekday;
  };

  // Check if date is in selection range
  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  // Check if date is being hovered over in range selection
  const isDateInHoverRange = (date: Date) => {
    if (!startDate || !hoveredDate || endDate) return false;
    const start = startDate < hoveredDate ? startDate : hoveredDate;
    const end = startDate < hoveredDate ? hoveredDate : startDate;
    return date >= start && date <= end;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date) || isDatePast(date)) return;

    if (!startDate || endDate) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
      onDateRangeSelect?.(date, null);
    } else {
      // Complete selection
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
        onDateRangeSelect?.(date, startDate);
      } else {
        setEndDate(date);
        onDateRangeSelect?.(startDate, date);
      }
    }
  };

  // Navigate months
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  // Navigate years
  const navigateYear = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + direction, currentDate.getMonth(), 1));
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const currentDateCopy = new Date(startCalendarDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      days.push(new Date(currentDateCopy));
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }
    
    return days;
  }, [startCalendarDate.getTime()]);

  // Generate years for decade view
  const decadeYears = useMemo(() => {
    const startYear = Math.floor(currentDate.getFullYear() / 10) * 10;
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
  }, [currentDate]);

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: window.innerWidth < 640 ? '16px' : '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const navigationButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const titleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: window.innerWidth < 640 ? '2px 4px' : '4px 8px',
    borderRadius: '6px',
    fontSize: window.innerWidth < 640 ? '14px' : '18px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  };

  const weekDaysStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: window.innerWidth < 640 ? '2px' : '4px',
    marginBottom: '8px',
  };

  const weekDayStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: window.innerWidth < 640 ? '10px' : '12px',
    fontWeight: '600',
    color: '#6b7280',
    padding: window.innerWidth < 640 ? '2px' : '4px',
  };

  const daysGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: window.innerWidth < 640 ? '2px' : '4px',
  };

  const dayStyle = (date: Date): React.CSSProperties => {
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isUnavailable = isDateUnavailable(date) || isDatePast(date);
    const isSelected = startDate?.toDateString() === date.toDateString() || 
                      endDate?.toDateString() === date.toDateString();
    const inRange = isDateInRange(date);
    const inHoverRange = isDateInHoverRange(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return {
      position: 'relative',
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: window.innerWidth < 640 ? '4px' : '8px',
      cursor: isUnavailable ? 'not-allowed' : 'pointer',
      backgroundColor: isSelected ? colors.primary : 
                      inRange ? `${colors.primary}20` :
                      inHoverRange ? `${colors.primary}10` :
                      isUnavailable ? '#f3f4f6' : 'white',
      color: isSelected ? 'white' :
             !isCurrentMonth ? '#d1d5db' :
             isUnavailable ? '#9ca3af' : '#1a1a1a',
      border: isToday ? `2px solid ${colors.primary}` : '1px solid transparent',
      transition: 'all 0.2s',
    };
  };

  const dayNumberStyle: React.CSSProperties = {
    fontSize: window.innerWidth < 640 ? '12px' : '14px',
    fontWeight: '500',
    marginBottom: window.innerWidth < 640 ? '0' : '2px',
  };

  const priceStyle = (date: Date): React.CSSProperties => {
    const isSelected = startDate?.toDateString() === date.toDateString() || 
                      endDate?.toDateString() === date.toDateString();
    const inRange = isDateInRange(date);
    
    return {
      fontSize: window.innerWidth < 640 ? '8px' : '10px',
      fontWeight: '400',
      color: isSelected ? 'white' : inRange ? colors.primary : '#6b7280',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
  };

  const monthGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth < 640 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
    gap: window.innerWidth < 640 ? '8px' : '12px',
    padding: window.innerWidth < 640 ? '12px 0' : '16px 0',
  };

  const monthButtonStyle = (month: number): React.CSSProperties => {
    const isCurrentMonth = month === currentDate.getMonth() && 
                          viewMode === 'year' && 
                          new Date().getFullYear() === currentDate.getFullYear();
    
    return {
      padding: window.innerWidth < 640 ? '12px' : '16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: isCurrentMonth ? colors.primary : 'white',
      color: isCurrentMonth ? 'white' : '#1a1a1a',
      fontSize: window.innerWidth < 640 ? '12px' : '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    };
  };

  const yearButtonStyle = (year: number): React.CSSProperties => {
    const isCurrentYear = year === new Date().getFullYear();
    
    return {
      padding: window.innerWidth < 640 ? '12px' : '16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: isCurrentYear ? colors.primary : 'white',
      color: isCurrentYear ? 'white' : '#1a1a1a',
      fontSize: window.innerWidth < 640 ? '12px' : '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    };
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <button
          style={navigationButtonStyle}
          onClick={() => {
            if (viewMode === 'month') navigateMonth(-1);
            else if (viewMode === 'year') navigateYear(-1);
            else navigateYear(-10);
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={titleContainerStyle}>
          {viewMode === 'month' && (
            <>
              <button
                style={titleButtonStyle}
                onClick={() => setViewMode('year')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {monthNames[currentDate.getMonth()]}
              </button>
              <button
                style={titleButtonStyle}
                onClick={() => setViewMode('decade')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {currentDate.getFullYear()}
              </button>
            </>
          )}
          {viewMode === 'year' && (
            <button
              style={titleButtonStyle}
              onClick={() => setViewMode('decade')}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {currentDate.getFullYear()}
            </button>
          )}
          {viewMode === 'decade' && (
            <span style={{ fontSize: '18px', fontWeight: '600' }}>
              {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
            </span>
          )}
        </div>

        <button
          style={navigationButtonStyle}
          onClick={() => {
            if (viewMode === 'month') navigateMonth(1);
            else if (viewMode === 'year') navigateYear(1);
            else navigateYear(10);
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Calendar Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'month' && (
          <motion.div
            key="month-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Week days */}
            <div style={weekDaysStyle}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={weekDayStyle}>{day}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={daysGridStyle}>
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isUnavailable = isDateUnavailable(date) || isDatePast(date);
                
                return (
                  <motion.div
                    key={index}
                    style={dayStyle(date)}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => !isUnavailable && setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                    whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                  >
                    <div style={dayNumberStyle}>{date.getDate()}</div>
                    {isCurrentMonth && !isUnavailable && (
                      <div style={priceStyle(date)}>{getPriceForDate(date)}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === 'year' && (
          <motion.div
            key="year-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={monthGridStyle}
          >
            {monthNames.map((month, index) => (
              <motion.button
                key={month}
                style={monthButtonStyle(index)}
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
                  setViewMode('month');
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                {month}
              </motion.button>
            ))}
          </motion.div>
        )}

        {viewMode === 'decade' && (
          <motion.div
            key="decade-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={monthGridStyle}
          >
            {decadeYears.map(year => (
              <motion.button
                key={year}
                style={yearButtonStyle(year)}
                onClick={() => {
                  setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                  setViewMode('year');
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                {year}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected dates summary */}
      {(startDate || endDate) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#4b5563',
          }}
        >
          {startDate && !endDate && (
            <div>Check-in: {startDate.toLocaleDateString()}</div>
          )}
          {startDate && endDate && (
            <>
              <div>Check-in: {startDate.toLocaleDateString()}</div>
              <div>Check-out: {endDate.toLocaleDateString()}</div>
              <div style={{ marginTop: '8px', fontWeight: '600', color: colors.primary }}>
                Total nights: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BookingCalendar;