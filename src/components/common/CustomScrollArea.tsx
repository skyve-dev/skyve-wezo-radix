import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface CustomScrollAreaProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const CustomScrollArea: React.FC<CustomScrollAreaProps> = ({ 
  children, 
  style,
  className 
}) => {
  const rootStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    ...style,
  };

  const viewportStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    paddingBottom: '80px', // Space for bottom navigation
    boxSizing: 'border-box',
  };

  return (
    <ScrollArea.Root 
      style={rootStyle} 
      className={className}
      type="scroll"
    >
      <ScrollArea.Viewport style={viewportStyle}>
        {children}
      </ScrollArea.Viewport>
      
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
};

export default CustomScrollArea;