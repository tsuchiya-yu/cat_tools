import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdScript from '@/components/JsonLdScript';
import { CAT_MEAL_MANAGEMENT_PATH } from '@/constants/paths';
import { MEAL_MANAGEMENT_META, MEAL_MANAGEMENT_UI_TEXT } from '@/constants/text';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';
import MealManagementCards from './MealManagementCards';

const breadcrumbStructuredData = createPageBreadcrumbList({
  name: MEAL_MANAGEMENT_UI_TEXT.BREADCRUMBS.MEAL_MANAGEMENT,
  path: CAT_MEAL_MANAGEMENT_PATH,
});

export const metadata: Metadata = {
  title: MEAL_MANAGEMENT_META.TITLE,
  description: MEAL_MANAGEMENT_META.DESCRIPTION,
  keywords: MEAL_MANAGEMENT_META.KEYWORDS,
  alternates: {
    canonical: CAT_MEAL_MANAGEMENT_PATH,
  },
  openGraph: {
    title: MEAL_MANAGEMENT_META.OG.TITLE,
    description: MEAL_MANAGEMENT_META.OG.DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: MEAL_MANAGEMENT_META.OG.URL,
    siteName: MEAL_MANAGEMENT_META.OG.SITE_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: MEAL_MANAGEMENT_META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: MEAL_MANAGEMENT_META.OG.TITLE,
    description: MEAL_MANAGEMENT_META.OG.DESCRIPTION,
    images: ['/og.png'],
  },
};

export default function MealManagementPage() {
  const uiText = MEAL_MANAGEMENT_UI_TEXT;

  return (
    <>
      <JsonLdScript data={breadcrumbStructuredData} />
      <main className="container max-w-3xl mx-auto px-6 pb-12">
        <Breadcrumbs
          items={[
            { label: uiText.BREADCRUMBS.HOME, href: '/' },
            { label: uiText.BREADCRUMBS.MEAL_MANAGEMENT },
          ]}
          className="mt-4"
        />

        {/* Hero Section */}
        <section className="section mt-6" aria-labelledby="meal-management-title">
          <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
            {uiText.HEADER.EYECATCH}
          </p>
          <h1
            id="meal-management-title"
            className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0"
          >
            {uiText.HEADER.TITLE}
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
            {uiText.HEADER.DESCRIPTION}
          </p>
        </section>

        {/* Intro: Differences & Usage */}
        <section className="section mt-8" aria-labelledby="intro-differences-title">
          <h2
            id="intro-differences-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.INTRO.TITLE}
          </h2>
          <div className="space-y-4">
            {uiText.INTRO.DIFFERENCES.map((item) => (
              <article
                key={item.TITLE}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">
                  {item.BODY}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-pink-200 bg-pink-50 p-4 space-y-2">
            <p className="text-sm font-bold text-pink-900">どこから始めるか・結果の使い方</p>
            <p className="text-sm text-pink-900 leading-relaxed text-pretty">
              {uiText.INTRO.START_GUIDE}
            </p>
            <p className="text-sm text-pink-900 leading-relaxed text-pretty">
              {uiText.INTRO.HOW_TO_USE}
            </p>
          </div>
        </section>

        {/* Primary Cards */}
        <section className="section mt-10" aria-labelledby="primary-tools-title">
          <h2
            id="primary-tools-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.PRIMARY_CARDS.TITLE}
          </h2>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {uiText.PRIMARY_CARDS.DESCRIPTION}
          </p>
          <MealManagementCards />
        </section>

        {/* Sequence: 6 Steps */}
        <section className="section mt-10" aria-labelledby="sequence-steps-title">
          <h2
            id="sequence-steps-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.SEQUENCE.TITLE}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty mb-5">
            {uiText.SEQUENCE.INTRO}
          </p>
          <div className="space-y-4">
            {uiText.SEQUENCE.STEPS.map((step) => (
              <div
                key={step.STEP}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
                    {step.STEP}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 text-balance">{step.TITLE}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">
                  {step.BODY}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Cases */}
        <section className="section mt-10" aria-labelledby="common-cases-title">
          <h2
            id="common-cases-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.CASES.TITLE}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty mb-5">
            {uiText.CASES.INTRO}
          </p>
          <div className="space-y-4">
            {uiText.CASES.ITEMS.map((item) => (
              <article
                key={item.TITLE}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">
                  {item.BODY}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Caution / Reference */}
        <section className="section mt-10" aria-labelledby="caution-title">
          <h2
            id="caution-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.CAUTION.TITLE}
          </h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-3">
            {uiText.CAUTION.ITEMS.map((item, idx) => (
              <p
                key={`caution-${idx}`}
                className="text-sm text-amber-950 leading-relaxed text-pretty"
              >
                ・{item}
              </p>
            ))}
          </div>
        </section>

        {/* Auxiliary Links */}
        <section className="section mt-10" aria-labelledby="auxiliary-tools-title">
          <h2
            id="auxiliary-tools-title"
            className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
          >
            {uiText.AUXILIARY.TITLE}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 mt-4">
            {uiText.AUXILIARY.ITEMS.map((aux) => (
              <Link
                key={aux.HREF}
                href={aux.HREF}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-pink-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {aux.TITLE}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                    {aux.DESCRIPTION}
                  </p>
                </div>
                <span className="mt-3 text-xs font-semibold text-pink-600 group-hover:text-pink-700">
                  {aux.ACTION}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
