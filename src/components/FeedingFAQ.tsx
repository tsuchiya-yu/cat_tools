"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';

type Item = { question: string; answer: ReactNode };

const FEEDING_FAQ_ITEMS: Item[] = [
  {
    question: '必要カロリー（kcal/日）が分かりません。どうすればいい？',
    answer: (
      <>
        <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold">猫のカロリー計算</Link>
        で体重などから1日の必要カロリーを求め、ここに入力してください。
      </>
    ),
  },
  {
    question: 'kcal/100g はどこで確認できますか？',
    answer:
      'パッケージやメーカーサイトの「代謝エネルギー：◯◯kcal/100g」を参照してください。\nウェットは「1袋あたり◯◯kcal」との表記があり、100g表記と混同しないよう注意してください。',
  },
  {
    question: '朝・夜の分け方はどうなっている？',
    answer:
      '朝=合計の半分（四捨五入）、夜=合計−朝 とし、端数は朝側で吸収します。',
  },
  {
    question: '結果はどれくらい正確？どう調整すればいい？',
    answer:
      '結果は目安です。\n体型・活動量で必要量は変わります。1〜2週間の変化を見て、与える量を5〜10%ずつ上下して調整してください。',
  },
  {
    question: '入力を共有・保存できますか？',
    answer:
      'URLを共有・ブックマークすれば、いつでも結果を確認できます。',
  },
];

export default function FeedingFAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const next = new Set(openItems);
    if (next.has(index)) next.delete(index); else next.add(index);
    setOpenItems(next);
  };

  return (
    <section className="section mt-10 mb-8" aria-labelledby="faqTitle">
      <h2 id="faqTitle" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
        よくある質問
      </h2>
      <div>
        {FEEDING_FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="border-none border-t border-gray-100 py-4"
            open={openItems.has(index)}
          >
            <summary
              className="list-none cursor-pointer flex items-center justify-between font-normal text-gray-900 hover:text-pink-600"
              onClick={(e) => {
                e.preventDefault();
                toggleItem(index);
              }}
            >
              {item.question}
              <svg
                className={`chev transition-transform duration-150 ease-out ${openItems.has(index) ? 'rotate-180' : ''}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#444"
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
