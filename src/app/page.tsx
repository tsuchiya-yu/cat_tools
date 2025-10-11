import Link from 'next/link';

export default function Home() {
  return (
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
        {[
          {
            href: '/calculate-cat-age',
            ariaLabel: '猫の年齢計算ツールを開く',
            title: '猫の年齢計算',
            description: '誕生日から人間年齢・ライフステージ・次の誕生日までを表示します。',
          },
          {
            href: '/calculate-cat-calorie',
            ariaLabel: '猫のカロリー計算ツールを開く',
            title: '猫のカロリー計算',
            description: '体重などから1日の必要カロリーと参考幅を表示します。',
          },
        ].map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
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
    </main>
  );
}
