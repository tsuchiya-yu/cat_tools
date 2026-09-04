'use client';

import { CAT_BCS_CHECK_FAQ_ITEMS } from '@/constants/text';

export default function CatBcsCheckFAQ() {
  return (
    <section className="section mt-10 mb-8" aria-labelledby="bcs-faq-title">
      <h2 id="bcs-faq-title" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
        よくある質問
      </h2>
      <div>
        {CAT_BCS_CHECK_FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group border-none border-t border-gray-100 py-4">
            <summary className="list-none cursor-pointer flex items-center justify-between gap-3 font-normal text-gray-900 hover:text-pink-600">
              <span>{item.question}</span>
              <svg
                className="chev shrink-0 transition-transform duration-150 ease-out group-open:rotate-180"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#444"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
