type GuideSectionProps = {
  whatTitle: string;
  whatDescription: string;
  usageTitle: string;
  usageItems: readonly string[];
  className?: string;
};

export default function GuideSection({
  whatTitle,
  whatDescription,
  usageTitle,
  usageItems,
  className = '',
}: GuideSectionProps) {
  return (
    <section className={`section rounded-2xl border border-gray-200 bg-gray-100/80 p-6 md:p-8 space-y-8 ${className}`.trim()}>
      <div className="space-y-3">
        <h2 className="text-[18px] font-bold">{whatTitle}</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{whatDescription}</p>
      </div>
      <div className="space-y-3">
        <h2 className="text-[18px] font-bold">{usageTitle}</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 leading-relaxed">
          {usageItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
