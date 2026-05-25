import Image, { type ImageProps } from 'next/image';

type ResponsiveImageProps = Omit<ImageProps, 'alt' | 'sizes'> & {
  alt: string;
  sizes: string;
};

export default function ResponsiveImage({ alt, sizes, ...props }: ResponsiveImageProps) {
  return <Image {...props} alt={alt} sizes={sizes} />;
}
