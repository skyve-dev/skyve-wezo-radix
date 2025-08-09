import React from 'react';
import { getAssetUrl } from '../../utils/basePath';

interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * AssetImage component that automatically handles base path for image sources
 * Use this component instead of img tag for all application images
 */
export const AssetImage: React.FC<AssetImageProps> = ({ src, alt, ...props }) => {
  return (
    <img
      {...props}
      src={getAssetUrl(src)}
      alt={alt}
    />
  );
};

export default AssetImage;