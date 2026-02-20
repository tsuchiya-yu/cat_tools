'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { calculateCatAge } from '@/lib/catAge';
import { CatAgeResult } from '@/types';
import DateInput from '@/components/DateInput';
import AgeResult from '@/components/AgeResult';
import FAQ from '@/components/FAQ';
import GuideSection from '@/components/GuideSection';
import { UI_TEXT } from '@/constants/text';
import Breadcrumbs from '@/components/Breadcrumbs';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cat-tools.catnote.tokyo';
const buildShareUrl = (birthDate: string) => {
  try {
    const url = new URL(`${DEFAULT_BASE_URL}/calculate-cat-age`);
    if (birthDate) {
      url.searchParams.set('dob', birthDate);
    }
    return url.toString();
  } catch (e) {
    console.error('Failed to build share URL due to invalid base URL:', e);
    return '';
  }
};

export default function CatAgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<CatAgeResult | null>(null);
  const [error, setError] = useState('');

  const syncBrowserUrl = useCallback((dateValue: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (dateValue) {
      url.searchParams.set('dob', dateValue);
    } else {
      url.searchParams.delete('dob');
    }
    window.history.replaceState(null, '', url.toString());
  }, []);

  const handleCalculate = useCallback((dateValue: string) => {
    setError('');
    
    if (!dateValue) {
      setError(UI_TEXT.INPUT.ERROR.REQUIRED);
      setResult(null);
      syncBrowserUrl(null);
      return;
    }

    const birthDateObj = new Date(dateValue);
    const today = new Date();

    if (isNaN(birthDateObj.getTime())) {
      setError(UI_TEXT.INPUT.ERROR.INVALID_DATE);
      setResult(null);
      syncBrowserUrl(null);
      return;
    }
    
    if (birthDateObj > today) {
      setError(UI_TEXT.INPUT.ERROR.FUTURE_DATE);
      setResult(null);
      syncBrowserUrl(null);
      return;
    }

    try {
      const calculatedResult = calculateCatAge(dateValue);
      setResult(calculatedResult);
      syncBrowserUrl(dateValue);
    } catch {
      setError(UI_TEXT.INPUT.ERROR.CALCULATION_ERROR);
      setResult(null);
      syncBrowserUrl(null);
    }
  }, [syncBrowserUrl]);

  // URL パラメータから初期値を設定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dobParam = params.get('dob');
    if (dobParam) {
      setBirthDate(dobParam);
      handleCalculate(dobParam);
    }
  }, [handleCalculate]);

  const handleDateChange = (value: string) => {
    setBirthDate(value);
    handleCalculate(value);
  };

  const shareUrl = useMemo(() => buildShareUrl(birthDate), [birthDate]);

  const shareBaseUrl = useMemo(() => {
    try {
      const url = new URL(shareUrl);
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      // shareUrlが予期せず不正な形式だった場合に備え、そのまま返す
      return shareUrl;
    }
  }, [shareUrl]);

  const shareText = useMemo(() => {
    if (!result) return '';
    return UI_TEXT.SHARE.SHARE_TEXT(result.humanAgeYears, result.humanAgeMonths, shareBaseUrl);
  }, [result, shareBaseUrl]);

  const content = UI_TEXT.CONTENT;

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
        <Breadcrumbs
          items={[
            { label: UI_TEXT.BREADCRUMBS.HOME, href: '/' },
            { label: UI_TEXT.BREADCRUMBS.CAT_AGE_CALCULATOR },
          ]}
          className="mt-4"
        />
        {/* Hero Section */}
        <section className="section mt-6">
          <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
            {UI_TEXT.HEADER.EYECATCH}
          </p>
          <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
            {UI_TEXT.HEADER.TITLE}
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-0 leading-relaxed">
            {UI_TEXT.HEADER.DESCRIPTION}
          </p>

          <div className="surface p-4 border-none overflow-hidden">
            <DateInput
              value={birthDate}
              onChange={handleDateChange}
              error={error}
            />
          </div>
        </section>

        {/* Result Section */}
        <AgeResult 
          result={result} 
          isVisible={!!result}
          shareText={shareText}
          shareUrl={shareUrl}
        />

        <section className="section mt-10" aria-labelledby="conversion-section-title">
          <h2 id="conversion-section-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
            {content.CONVERSION.TITLE}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{content.CONVERSION.INTRO}</p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
            {content.CONVERSION.BODY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.CONVERSION.NOTE}</p>
        </section>

        <section className="section mt-10" aria-labelledby="life-stage-care-title">
          <h2 id="life-stage-care-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
            {content.LIFE_STAGE_CARE.TITLE}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content.LIFE_STAGE_CARE.INTRO}</p>
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
          <h3 className="mt-5 text-base font-bold text-gray-900">観察ポイント</h3>
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
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed">
            {content.LONGEVITY_CHECKLIST.ITEMS.map((item) => (
              <li key={item}>{item}</li>
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
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600 leading-relaxed mt-4">
            {content.AVERAGE_LIFESPAN.NOTE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section mt-10" aria-labelledby="references-title">
          <h2 id="references-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
            {content.REFERENCES.TITLE}
          </h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-700 leading-relaxed">
            {content.REFERENCES.LINKS.map((link) => (
              <li key={link.URL}>
                <a
                  href={link.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
                >
                  {link.LABEL}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.REFERENCES.DISCLAIMER}</p>
        </section>

        {/* FAQ Section */}
        <FAQ />

        <GuideSection
          className="mt-8"
          whatTitle={UI_TEXT.GUIDE.WHAT_TITLE}
          whatDescription={UI_TEXT.GUIDE.WHAT_DESCRIPTION}
          usageTitle={UI_TEXT.GUIDE.USAGE_TITLE}
          usageItems={UI_TEXT.GUIDE.USAGE_ITEMS}
        />
    </main>
  );
}
