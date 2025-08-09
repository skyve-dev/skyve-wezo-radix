import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircledIcon, Cross2Icon } from '@radix-ui/react-icons';

interface SuccessNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  duration?: number;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  onClose,
  title,
  description,
  duration = 4000,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isVisible && !isHovered) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isHovered, duration, onClose]);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '320px',
    maxWidth: '90vw',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 38px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.22)',
    border: '1px solid #e5e7eb',
    zIndex: 200,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    paddingRight: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
    marginBottom: '4px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.4',
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    color: '#9ca3af',
    marginLeft: 'auto',
    flexShrink: 0,
  };

  const progressBarStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: '#22c55e',
    borderRadius: '0 0 12px 12px',
    transformOrigin: 'left',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={containerStyle}
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={headerStyle}>
            <div style={iconContainerStyle}>
              <CheckCircledIcon 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  color: '#22c55e'
                }} 
              />
            </div>
            <div style={contentStyle}>
              <h4 style={titleStyle}>{title}</h4>
              <p style={descriptionStyle}>{description}</p>
            </div>
            <motion.button
              style={closeButtonStyle}
              onClick={onClose}
              whileHover={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
              whileTap={{ scale: 0.95 }}
            >
              <Cross2Icon style={{ width: '16px', height: '16px' }} />
            </motion.button>
          </div>
          
          {/* Progress bar */}
          {!isHovered && (
            <motion.div
              style={progressBarStyle}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessNotification;