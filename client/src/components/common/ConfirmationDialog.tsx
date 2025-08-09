import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, Cross2Icon } from '@radix-ui/react-icons';
import { colors } from '../../utils/colors';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  };

  const contentStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '320px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 38px rgba(0, 0, 0, 0.35)',
    zIndex: 101,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '20px',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variant === 'danger' ? '#FEE2E2' : colors.primaryLight,
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
    marginBottom: '8px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: 0,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: isLoading ? 0.6 : 1,
  };

  const confirmButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: variant === 'danger' ? '#dc2626' : colors.primary,
    border: 'none',
    borderRadius: '6px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: isLoading ? 0.6 : 1,
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle}>
          <Dialog.Title style={{ display: 'none' }}>{title}</Dialog.Title>
          <Dialog.Description style={{ display: 'none' }}>{description}</Dialog.Description>
          
          <button
            style={closeButtonStyle}
            onClick={handleCancel}
            disabled={isLoading}
          >
            <Cross2Icon style={{ width: '16px', height: '16px' }} />
          </button>

          <div style={headerStyle}>
            <div style={iconContainerStyle}>
              <ExclamationTriangleIcon 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: variant === 'danger' ? '#dc2626' : colors.primary 
                }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={descriptionStyle}>{description}</p>
            </div>
          </div>

          <div style={actionsStyle}>
            <motion.button
              style={cancelButtonStyle}
              onClick={handleCancel}
              disabled={isLoading}
              whileHover={!isLoading ? { backgroundColor: '#f3f4f6' } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {cancelText}
            </motion.button>
            <motion.button
              style={confirmButtonStyle}
              onClick={handleConfirm}
              disabled={isLoading}
              whileHover={!isLoading ? { 
                backgroundColor: variant === 'danger' ? '#b91c1c' : colors.primaryHover 
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? 'Processing...' : confirmText}
            </motion.button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmationDialog;