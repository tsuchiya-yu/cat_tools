import { CAT_BCS_CHECK_UI_TEXT } from '@/constants/text';

const LEVELS = [
  { score: 1, label: '痩せ', width: '28%' },
  { score: 2, label: 'やや痩せ', width: '36%' },
  { score: 3, label: '理想', width: '44%' },
  { score: 4, label: 'やや肥満', width: '56%' },
  { score: 5, label: '肥満', width: '68%' },
] as const;

/** 環境省原典図の転載ではなく、観察の流れを示す自作の説明図 */
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

      <figure className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <svg
          viewBox="0 0 640 220"
          role="img"
          aria-label={text.ALT}
          className="w-full h-auto"
        >
          <title>{text.ALT}</title>
          {LEVELS.map((level, index) => {
            const x = 28 + index * 124;
            const bodyWidth = Number.parseFloat(level.width);
            const bodyX = x + (100 - bodyWidth) / 2;
            return (
              <g key={level.score}>
                <text
                  x={x + 50}
                  y={28}
                  textAnchor="middle"
                  className="fill-gray-900"
                  fontSize="14"
                  fontWeight="700"
                >
                  BCS {level.score}
                </text>
                <ellipse
                  cx={x + 50}
                  cy={96}
                  rx={bodyWidth / 2}
                  ry={28 + level.score * 2}
                  className="fill-pink-100 stroke-pink-600"
                  strokeWidth="2"
                />
                <circle
                  cx={x + 22}
                  cy={78}
                  r={12}
                  className="fill-pink-50 stroke-pink-600"
                  strokeWidth="2"
                />
                <text
                  x={x + 50}
                  y={160}
                  textAnchor="middle"
                  className="fill-gray-700"
                  fontSize="12"
                >
                  {level.label}
                </text>
                <text
                  x={bodyX + bodyWidth / 2}
                  y={196}
                  textAnchor="middle"
                  className="fill-gray-500"
                  fontSize="11"
                >
                  {level.score <= 2 ? '細い' : level.score === 3 ? 'くびれあり' : '丸み'}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-3 space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>{text.CREDIT}</p>
          <p>
            <a
              href={text.SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
            >
              {text.SOURCE_LABEL}
            </a>
          </p>
          <p className="text-gray-500">{text.NOTE}</p>
        </figcaption>
      </figure>
    </section>
  );
}
