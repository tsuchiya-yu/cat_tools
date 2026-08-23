import Link from 'next/link';
import JsonLdScript from '@/components/JsonLdScript';
import { CAT_MEAL_MANAGEMENT_PATH } from '@/constants/paths';
import { HOME_ABOUT_TEXT, TOOLS } from '@/constants/text';
import { createHomeBreadcrumbList } from '@/lib/breadcrumbStructuredData';

const homeBreadcrumbStructuredData = createHomeBreadcrumbList();

export default function Home() {
  return (
    <>
      <JsonLdScript data={homeBreadcrumbStructuredData} />
      <main className="container max-w-3xl mx-auto px-6 pb-12">
        {/* Hero */}
        <section className="section mt-6" aria-labelledby="home-title">
          <h1 id="home-title" className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
            ねこツールズ
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-0 leading-relaxed">
            飼い主さんのために猫に関する便利なツールを集めています。
          </p>
        </section>

        {/* Tools */}
        <section className="section mt-8 space-y-4" aria-label="ツール一覧">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              prefetch={false}
              aria-label={tool.ariaLabel}
              className="block no-underline rounded-xl border border-[var(--border)] bg-white p-5 transition-shadow hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
            >
              <h2 className="text-xl font-bold text-[var(--text)]">{tool.title}</h2>
              <p className="text-sm text-gray-600 mt-1.5">
                {tool.description}
              </p>
              <span className="inline-block mt-3 text-pink-600 font-semibold">
                使ってみる →
              </span>
            </Link>
          ))}
        </section>

        {/* Meal Management Guide */}
        <section
          className="section mt-8"
          aria-labelledby="meal-management-guide-title"
        >
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <h2 id="meal-management-guide-title" className="text-xl font-bold text-[var(--text)]">
              猫の食事管理に迷ったら
            </h2>
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
              必要カロリー・給餌量・水分量の違いと、計算ツールを使うおすすめの順番をまとめたガイドです。
            </p>
            <Link
              href={CAT_MEAL_MANAGEMENT_PATH}
              aria-label="猫の食事管理ガイドを見る"
              className="inline-block mt-3 text-pink-600 font-semibold hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
            >
              猫の食事管理ガイドを見る →
            </Link>
          </div>
        </section>

        <section
          className="section mt-10"
          aria-labelledby="about-site-title"
        >
          <h2 id="about-site-title" className="text-xl font-bold text-[var(--text)]">
            {HOME_ABOUT_TEXT.TITLE}
          </h2>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-gray-700">
            <p>{HOME_ABOUT_TEXT.DESCRIPTION}</p>
            <div>
              <h3 className="font-bold text-[var(--text)]">{HOME_ABOUT_TEXT.OPERATOR_TITLE}</h3>
              <p className="mt-1">{HOME_ABOUT_TEXT.OPERATOR_DESCRIPTION}</p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">{HOME_ABOUT_TEXT.NOTICE_TITLE}</h3>
              <p className="mt-1">{HOME_ABOUT_TEXT.NOTICE_DESCRIPTION}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
