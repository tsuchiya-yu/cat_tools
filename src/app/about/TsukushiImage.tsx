export default function TsukushiImage() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
      <picture>
        <source srcSet="/images/about/tsukushi.webp" type="image/webp" />
        <img
          src="/images/about/tsukushi.jpg"
          alt="保護猫のつくし"
          width={900}
          height={1125}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </picture>
    </div>
  );
}
