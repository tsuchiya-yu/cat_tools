'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '誕生日がはっきり分からないときは？',
    answer: 'だいたいで大丈夫です。月だけ分かるなら「その月の1日 or 15日」、年だけなら「その年の7/1」など、近い日を入れて目安として使ってください。'
  },
  {
    question: '入力を変えるとすぐ計算されますか？',
    answer: 'はい。日付を変更すると下の結果が自動で更新されます。'
  },
  {
    question: 'どうやって換算しているの？',
    answer: '目安として「1歳=人の15歳、2歳=24歳、以降は1年ごとに+4歳」で計算し、月はなめらかに補間しています。'
  },
  {
    question: 'ライフステージは何の役に立つ？',
    answer: '成長のだいたいの段階が分かります。\n・子猫：遊びやすい環境づくり\n・若年成猫：遊び＋体重管理のペースづくり\n・成猫：生活リズムの見直しに\n・シニア：無理のない運動やチェックの目安に'
  },
  {
    question: '結果は共有できますか？プライバシーは？',
    answer: '右上の共有ボタンからURLをコピー・共有できます。サーバーには何も送信されず、URLに含まれるのは誕生日の日付だけです。'
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="section mt-10 mb-8" aria-labelledby="faqTitle">
      <h2 id="faqTitle" className="section-title mt-10 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
        よくある質問
      </h2>
      <div>
        {faqData.map((item, index) => (
          <details
            key={index}
            className="border-none border-t border-gray-100 py-4.5"
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
                className={`chev transition-transform duration-150 ease-out ${
                  openItems.has(index) ? 'rotate-180' : ''
                }`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#444"
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </summary>
            {openItems.has(index) && (
              <div className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                {item.answer}
              </div>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
