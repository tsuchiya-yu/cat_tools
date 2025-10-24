'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/constants/text';

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
      <h2 id="faqTitle" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
        よくある質問
      </h2>
      <div>
        {FAQ_ITEMS.map((item, index) => (
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
