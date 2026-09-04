'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CatBcsCheckFAQ from '@/components/CatBcsCheckFAQ';
import CatBcsReferenceFigure from '@/components/CatBcsReferenceFigure';
import GuideSection from '@/components/GuideSection';
import {
  CALCULATE_CAT_CALORIE_PATH,
  CALCULATE_CAT_FEEDING_PATH,
} from '@/constants/paths';
import { CAT_BCS_CHECK_UI_TEXT } from '@/constants/text';
import {
  evaluateCatBcs,
  getCatBcsGuidanceBand,
  type CatBcsGuidanceBand,
  type CatBcsResult,
  type Score,
} from '@/lib/catBcsCheck';

type QuestionKey = 'ribs' | 'waist' | 'abdomen';

const SCORE_VALUES: Score[] = [1, 2, 3, 4, 5];

function isScore(value: number): value is Score {
  return SCORE_VALUES.includes(value as Score);
}

function adjacentLabelKey(lower: Score, upper: Score): keyof typeof CAT_BCS_CHECK_UI_TEXT.RESULT.ADJACENT_LABELS {
  return `${lower}-${upper}` as keyof typeof CAT_BCS_CHECK_UI_TEXT.RESULT.ADJACENT_LABELS;
}

function QuestionFieldset({
  questionKey,
  title,
  options,
  value,
  onChange,
}: {
  questionKey: QuestionKey;
  title: string;
  options: readonly { value: number; label: string }[];
  value: Score | null;
  onChange: (score: Score) => void;
}) {
  const legendId = `${questionKey}-legend`;

  return (
    <fieldset className="mt-8 border-0 p-0 m-0" aria-labelledby={legendId}>
      <legend id={legendId} className="text-base sm:text-lg font-bold text-gray-900 text-balance px-0">
        {title}
      </legend>
      <div className="mt-4 space-y-3" role="radiogroup" aria-labelledby={legendId}>
        {options.map((option) => {
          const optionId = `${questionKey}-option-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`flex gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${
                checked
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-pink-200'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={questionKey}
                value={option.value}
                checked={checked}
                onChange={() => {
                  if (isScore(option.value)) onChange(option.value);
                }}
                className="mt-1 h-4 w-4 shrink-0 accent-pink-600"
              />
              <span className="text-sm text-gray-800 leading-relaxed text-pretty">
                <span className="font-semibold text-gray-900 mr-2">{option.value}.</span>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResultSummary({
  ribs,
  waist,
  abdomen,
  result,
}: {
  ribs: Score;
  waist: Score;
  abdomen: Score;
  result: CatBcsResult;
}) {
  const text = CAT_BCS_CHECK_UI_TEXT.RESULT;
  let headline = '';
  let detail = '';
  let notes: string[] = [];

  if (result.type === 'match') {
    headline = text.MATCH_HEADLINE(result.score);
    detail = text.MATCH_LABELS[result.score];
  } else if (result.type === 'adjacent') {
    headline = text.ADJACENT_HEADLINE(result.lower, result.upper);
    detail = text.ADJACENT_LABELS[adjacentLabelKey(result.lower, result.upper)];
    notes = [text.ADJACENT_NOTE];
  } else {
    headline = text.UNRESOLVED_HEADLINE;
    notes =
      result.reason === 'palpation_vs_visual' ? [...text.UNRESOLVED_PALPATION] : [...text.UNRESOLVED_OTHER];
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm"
      aria-labelledby="bcs-result-title"
      data-testid="bcs-result"
      data-result-type={result.type}
    >
      <h2 id="bcs-result-title" className="text-xl font-extrabold text-gray-900 text-balance">
        {text.TITLE}
      </h2>
      <p className="mt-2 text-sm text-gray-600">{text.NOT_DIAGNOSIS}</p>

      <div className="mt-5 space-y-2" aria-live="polite">
        <p className="text-lg font-bold text-gray-900 text-balance">{headline}</p>
        {detail ? <p className="text-sm text-gray-800 leading-relaxed">{detail}</p> : null}
        {notes.map((note) => (
          <p key={note} className="text-sm text-gray-700 leading-relaxed text-pretty">
            {note}
          </p>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-gray-800">
        <dt className="font-semibold text-gray-900">{text.BREAKDOWN.RIBS}</dt>
        <dd className="tabular-nums">{ribs}</dd>
        <dt className="font-semibold text-gray-900">{text.BREAKDOWN.WAIST}</dt>
        <dd className="tabular-nums">{waist}</dd>
        <dt className="font-semibold text-gray-900">{text.BREAKDOWN.ABDOMEN}</dt>
        <dd className="tabular-nums">{abdomen}</dd>
      </dl>

      <p className="mt-5 text-xs sm:text-sm text-gray-500 leading-relaxed">{text.REFERENCE_NOTE}</p>
    </section>
  );
}

function GuidanceSection({ band }: { band: CatBcsGuidanceBand }) {
  const guidance = CAT_BCS_CHECK_UI_TEXT.GUIDANCE;
  const content =
    band === 'lean'
      ? guidance.LEAN
      : band === 'ideal'
        ? guidance.IDEAL
        : band === 'heavy'
          ? guidance.HEAVY
          : guidance.UNRESOLVED;

  const showTools = band === 'lean' || band === 'ideal' || band === 'heavy';

  return (
    <section className="mt-6 rounded-2xl border border-pink-200 bg-pink-50 p-5" aria-labelledby="bcs-guidance-title">
      <h2 id="bcs-guidance-title" className="text-base font-bold text-pink-900 text-balance">
        {content.TITLE}
      </h2>
      <div className="mt-3 space-y-2">
        {content.BODY.map((paragraph) => (
          <p key={paragraph} className="text-sm text-pink-900 leading-relaxed text-pretty">
            {paragraph}
          </p>
        ))}
      </div>

      {showTools && 'TOOL_NOTE' in content ? (
        <>
          <p className="mt-4 text-sm text-pink-900 leading-relaxed text-pretty">{content.TOOL_NOTE}</p>
          <ul className="mt-3 flex flex-col gap-2 sm:flex-row">
            <li>
              <Link
                href={CALCULATE_CAT_CALORIE_PATH}
                className="inline-flex rounded-full border border-pink-600 bg-white px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-100"
              >
                {guidance.CALORIE_LINK}
              </Link>
            </li>
            <li>
              <Link
                href={CALCULATE_CAT_FEEDING_PATH}
                className="inline-flex rounded-full border border-pink-600 bg-white px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-100"
              >
                {guidance.FEEDING_LINK}
              </Link>
            </li>
          </ul>
        </>
      ) : null}
    </section>
  );
}

function SupplementaryContent() {
  const text = CAT_BCS_CHECK_UI_TEXT.SUPPLEMENTARY;

  return (
    <>
      <section className="section mt-10" aria-labelledby="bcs-what-title">
        <h2 id="bcs-what-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.WHAT_IS_BCS.TITLE}
        </h2>
        <div className="space-y-3">
          {text.WHAT_IS_BCS.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="bcs-levels-title">
        <h2 id="bcs-levels-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.LEVELS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">{text.LEVELS.INTRO}</p>
        <div className="mt-5 space-y-4">
          {text.LEVELS.ITEMS.map((item) => (
            <article key={item.TITLE} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed text-pretty">{text.LEVELS.NOTE}</p>
      </section>

      <section className="section mt-10" aria-labelledby="bcs-weight-title">
        <h2 id="bcs-weight-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.WEIGHT.TITLE}
        </h2>
        <div className="space-y-3">
          {text.WEIGHT.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="bcs-mcs-title">
        <h2 id="bcs-mcs-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.MCS.TITLE}
        </h2>
        <div className="space-y-3">
          {text.MCS.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="bcs-cases-title">
        <h2 id="bcs-cases-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.CASES.TITLE}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">{text.CASES.PRIORITY_TITLE}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed">
              {text.CASES.PRIORITY_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">{text.CASES.CAUTION_TITLE}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed">
              {text.CASES.CAUTION_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <CatBcsCheckFAQ />

      <section className="section mt-10" aria-labelledby="bcs-references-title">
        <h2 id="bcs-references-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          {text.REFERENCES.TITLE}
        </h2>
        <div className="space-y-3">
          {text.REFERENCES.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {text.REFERENCES.LINKS.map((source) => (
            <li key={source.URL}>
              <a
                href={source.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
              >
                {source.LABEL}
              </a>
              <span className="text-gray-600"> — {source.NOTE}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section mt-10 mb-4" aria-labelledby="bcs-disclaimer-title">
        <h2 id="bcs-disclaimer-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance">
          免責事項
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">{text.DISCLAIMER}</p>
      </section>
    </>
  );
}

export default function CatBcsCheck() {
  const text = CAT_BCS_CHECK_UI_TEXT;
  const [ribs, setRibs] = useState<Score | null>(null);
  const [waist, setWaist] = useState<Score | null>(null);
  const [abdomen, setAbdomen] = useState<Score | null>(null);

  const result = useMemo(() => {
    if (ribs == null || waist == null || abdomen == null) return null;
    return evaluateCatBcs({ ribs, waist, abdomen });
  }, [ribs, waist, abdomen]);

  const guidanceBand = useMemo(
    () => (result ? getCatBcsGuidanceBand(result) : null),
    [result],
  );

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      <Breadcrumbs
        items={[
          { label: text.BREADCRUMBS.HOME, href: '/' },
          { label: text.BREADCRUMBS.CAT_BCS_CHECK },
        ]}
        className="mt-4"
      />

      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">{text.HEADER.EYECATCH}</p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0 text-balance">
          {text.HEADER.TITLE}
        </h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed text-pretty">
          {text.HEADER.DESCRIPTION}
        </p>

        <GuideSection
          whatTitle={text.GUIDE.WHAT_TITLE}
          whatDescription={text.GUIDE.WHAT_DESCRIPTION}
          usageTitle={text.GUIDE.USAGE_TITLE}
          usageItems={text.GUIDE.USAGE_ITEMS}
        />

        <CatBcsReferenceFigure />

        <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5" aria-labelledby="bcs-precheck-title">
          <h2 id="bcs-precheck-title" className="text-base font-bold text-gray-900">
            {text.PRECHECK.TITLE}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed">
            {text.PRECHECK.ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="bcs-palpation-title">
          <h2 id="bcs-palpation-title" className="text-xl md:text-2xl font-extrabold text-gray-900 text-balance">
            {text.PALPATION_GUIDE.TITLE}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700 leading-relaxed">
            {text.PALPATION_GUIDE.STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <QuestionFieldset
          questionKey="ribs"
          title={text.QUESTIONS.Q1.TITLE}
          options={text.QUESTIONS.Q1.OPTIONS}
          value={ribs}
          onChange={setRibs}
        />
        <QuestionFieldset
          questionKey="waist"
          title={text.QUESTIONS.Q2.TITLE}
          options={text.QUESTIONS.Q2.OPTIONS}
          value={waist}
          onChange={setWaist}
        />
        <QuestionFieldset
          questionKey="abdomen"
          title={text.QUESTIONS.Q3.TITLE}
          options={text.QUESTIONS.Q3.OPTIONS}
          value={abdomen}
          onChange={setAbdomen}
        />

        <aside className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 leading-relaxed text-pretty">
          {text.POUCH_NOTE}
        </aside>

        {result && ribs != null && waist != null && abdomen != null ? (
          <>
            <ResultSummary ribs={ribs} waist={waist} abdomen={abdomen} result={result} />
            {guidanceBand ? <GuidanceSection band={guidanceBand} /> : null}
          </>
        ) : (
          <p className="mt-8 text-sm text-gray-600 leading-relaxed" aria-live="polite">
            {text.RESULT.PENDING}
          </p>
        )}
      </section>

      <SupplementaryContent />
    </main>
  );
}
