import ResponsiveImage from '@/components/ResponsiveImage';
import { CAT_BCS_CHECK_UI_TEXT } from '@/constants/text';

/** 環境省ガイドライン掲載図をWeb表示向けに切り出したもの */
export default function CatBcsReferenceFigure() {
  const text = CAT_BCS_CHECK_UI_TEXT.REFERENCE_IMAGE;

  return (
    <section className="mt-8" aria-labelledby="bcs-reference-image-title">
      <h2
        id="bcs-reference-image-title"
        className="text-xl md:text-2xl font-extrabold text-gray-900 text-balance"
      >
        {text.TITLE}
      </h2>
      <p className="mt-3 text-sm text-gray-700 leading-relaxed text-pretty">{text.DESCRIPTION}</p>

      <figure className="mt-5 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
        <ResponsiveImage
          src="/bcs/env-cat-bcs-chart.webp"
          alt={text.ALT}
          width={1400}
          height={833}
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full h-auto rounded-lg"
          priority={false}
        />
        <figcaption className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed px-1">
          {text.CREDIT_PREFIX}
          <a
            href={text.SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-700 hover:text-pink-800 underline underline-offset-2"
          >
            {text.SOURCE_LABEL}
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
