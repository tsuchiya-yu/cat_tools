import Link from 'next/link';
import { UI_TEXT } from '@/constants/text';

export default function CatAgeContent() {
  const content = UI_TEXT.CONTENT;

  return (
    <>
      <section className="section mt-10" aria-labelledby="conversion-section-title">
        <h2 id="conversion-section-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.CONVERSION.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.CONVERSION.INTRO}</p>
        <div className="overflow-x-auto mt-5">
          <table className="w-full border-collapse text-sm text-left">
            <caption className="sr-only">猫年齢と人間年齢の早見表</caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold text-gray-900">{content.CONVERSION.TABLE_HEADERS.CAT_AGE}</th>
                <th className="py-2 font-semibold text-gray-900">{content.CONVERSION.TABLE_HEADERS.HUMAN_AGE}</th>
              </tr>
            </thead>
            <tbody>
              {content.CONVERSION.TABLE.map((row) => (
                <tr key={row.CAT_AGE} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-700">{row.CAT_AGE}</td>
                  <td className="py-2 text-gray-700">{row.HUMAN_AGE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-5 text-base font-bold text-gray-900">{content.CONVERSION.FORMULA_TITLE}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-2">
          {content.CONVERSION.BODY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.CONVERSION.NOTE}</p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.CONVERSION.SOURCES.map((source) => (
            <li key={source.URL}>
              <a
                href={source.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
              >
                出典: {source.LABEL}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section mt-10" aria-labelledby="life-stage-care-title">
        <h2 id="life-stage-care-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.LIFE_STAGE_CARE.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content.LIFE_STAGE_CARE.INTRO}</p>
        <h3 className="mt-4 text-base font-bold text-gray-900">{content.LIFE_STAGE_CARE.BCS_TITLE}</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-2">
          {content.LIFE_STAGE_CARE.BCS_CRITERIA.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="space-y-4 mt-5">
          {content.LIFE_STAGE_CARE.ITEMS.map((item) => (
            <article key={item.STAGE} className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <h3 className="text-base font-bold text-gray-900">{item.STAGE}</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-2">
                {item.POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.LIFE_STAGE_CARE.LINKS.map((link) => (
            <li key={link.HREF}>
              <Link href={link.HREF} className="text-pink-700 hover:text-pink-800 underline underline-offset-2">
                {link.LABEL}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section mt-10" aria-labelledby="unknown-age-guide-title">
        <h2 id="unknown-age-guide-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.UNKNOWN_AGE_GUIDE.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.UNKNOWN_AGE_GUIDE.INTRO}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.UNKNOWN_AGE_GUIDE.BODY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="mt-5 text-base font-bold text-gray-900">{content.UNKNOWN_AGE_GUIDE.ITEMS_TITLE}</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-2">
          {content.UNKNOWN_AGE_GUIDE.ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.UNKNOWN_AGE_GUIDE.NOTE}</p>
      </section>

      <section className="section mt-10" aria-labelledby="longevity-checklist-title">
        <h2 id="longevity-checklist-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.LONGEVITY_CHECKLIST.TITLE}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
          {content.LONGEVITY_CHECKLIST.ITEMS.map((item) => (
            <li key={item}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-pink-600" />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.LONGEVITY_CHECKLIST.LINKS.map((link) => (
            <li key={link.HREF}>
              <Link href={link.HREF} className="text-pink-700 hover:text-pink-800 underline underline-offset-2">
                {link.LABEL}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section mt-10" aria-labelledby="red-flags-title">
        <h2 id="red-flags-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.RED_FLAGS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.RED_FLAGS.INTRO}</p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.RED_FLAGS.ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="rounded-xl border border-pink-200 bg-pink-50/60 p-4 mt-5">
          <h3 className="text-base font-bold text-pink-900">{content.RED_FLAGS.NOTE.TITLE}</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-pink-900 leading-relaxed mt-2">
            {content.RED_FLAGS.NOTE.ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="average-lifespan-title">
        <h2 id="average-lifespan-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          {content.AVERAGE_LIFESPAN.TITLE}
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed">
          {content.AVERAGE_LIFESPAN.BODY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {content.AVERAGE_LIFESPAN.SOURCES.map((source) => (
            <li key={source.URL}>
              <a
                href={source.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
              >
                出典: {source.LABEL}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
