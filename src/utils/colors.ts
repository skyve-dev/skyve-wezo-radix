export const colors = {
  // Brand Colors
  primary: '#DF1F1A',
  primaryHover: '#C11B16',
  primaryLight: '#F7E8E7',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#1A1A1A',
  
  // Status Colors
  success: '#059669',
  successHover: '#047857',
  successLight: '#F0FDF4',
  
  error: '#EF4444',
  errorLight: '#FEF2F2',
  
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  
  info: '#3B82F6',
  infoLight: '#EFF6FF',
} as const;

export type ColorKey = keyof typeof colors;