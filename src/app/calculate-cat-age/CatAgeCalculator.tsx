'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateCatAge } from '@/lib/catAge';
import { CatAgeResult } from '@/types';
import DateInput from '@/components/DateInput';
import AgeResult from '@/components/AgeResult';
import FAQ from '@/components/FAQ';
import GuideSection from '@/components/GuideSection';
import CatAgeContent from './CatAgeContent';
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
        <CatAgeContent />

        {/* FAQ Section */}
        <FAQ />

        <GuideSection
          className="mt-8"
          whatTitle={UI_TEXT.GUIDE.WHAT_TITLE}
          whatDescription={UI_TEXT.GUIDE.WHAT_DESCRIPTION}
          usageTitle={UI_TEXT.GUIDE.USAGE_TITLE}
          usageItems={UI_TEXT.GUIDE.USAGE_ITEMS}
        />

        <section className="section mt-8" aria-label="免責事項">
          <p className="text-sm text-gray-600 leading-relaxed">{UI_TEXT.CONTENT.DISCLAIMER}</p>
        </section>
    </main>
  );
}
