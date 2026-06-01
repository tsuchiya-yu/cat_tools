import ResponsiveImage from '@/components/ResponsiveImage';

export default function TsukushiImage() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
      <ResponsiveImage
        src="/images/about/tsukushi.webp"
        alt="保護猫のつくし"
        fill
        sizes="220px"
        className="object-cover"
      />
    </div>
  );
}
