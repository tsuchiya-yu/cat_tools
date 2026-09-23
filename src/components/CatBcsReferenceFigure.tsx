'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { CAT_BCS_CHECK_UI_TEXT } from '@/constants/text';

/** 環境省ガイドライン掲載図をWeb表示向けに切り出したもの */
export default function CatBcsReferenceFigure() {
  const text = CAT_BCS_CHECK_UI_TEXT.REFERENCE_IMAGE;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      closeButtonRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
          return;
        }
        if (event.key !== 'Tab') return;

        const targets = [closeButtonRef.current, imageScrollRef.current].filter(Boolean);
        if (targets.length === 0) return;
        const active = document.activeElement;
        const index = targets.indexOf(
          active as HTMLButtonElement | HTMLDivElement | null,
        );
        const nextIndex = event.shiftKey
          ? (index <= 0 ? targets.length - 1 : index - 1)
          : (index < 0 || index >= targets.length - 1 ? 0 : index + 1);
        event.preventDefault();
        targets[nextIndex]?.focus();
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }

    if (hasOpenedRef.current) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const onImageKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const el = imageScrollRef.current;
    if (!el) return;
    const step = 80;
    switch (event.key) {
      case 'ArrowLeft':
        el.scrollBy({ left: -step, top: 0, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'ArrowRight':
        el.scrollBy({ left: step, top: 0, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'ArrowUp':
        el.scrollBy({ left: 0, top: -step, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'ArrowDown':
        el.scrollBy({ left: 0, top: step, behavior: 'smooth' });
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <section className="mt-8" aria-labelledby="bcs-reference-image-title">
      <h2
        id="bcs-reference-image-title"
        className="text-xl md:text-2xl font-extrabold text-gray-900 text-balance"
      >
        {text.TITLE}
      </h2>
      <p className="mt-3 text-sm text-gray-700 leading-relaxed text-pretty">{text.DESCRIPTION}</p>

      <figure className="mt-5 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
        <button
          ref={triggerRef}
          type="button"
          onClick={openDialog}
          className="block w-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2"
          aria-haspopup="dialog"
          aria-label="BCS参考図を拡大表示"
        >
          <ResponsiveImage
            src="/bcs/env-cat-bcs-chart.webp"
            alt={text.ALT}
            width={1400}
            height={833}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto rounded-lg"
            priority={false}
          />
        </button>
        <figcaption className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed px-1">
          {text.CREDIT_PREFIX}
          <a
            href={text.SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-700 hover:text-pink-800 underline underline-offset-2"
          >
            {text.SOURCE_LABEL}
          </a>
        </figcaption>
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bcs-reference-dialog-title"
            className="max-h-[calc(100vh-2rem)] w-full max-w-6xl rounded-2xl bg-white p-3 shadow-2xl sm:max-h-[calc(100vh-4rem)] sm:p-5"
          >
            <h2 id="bcs-reference-dialog-title" className="sr-only">
              {text.TITLE}（拡大表示）
            </h2>
            <div className="flex items-center justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDialog}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-gray-900 px-3 text-2xl leading-none text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2"
                aria-label="拡大表示を閉じる"
              >
                ×
              </button>
            </div>
            <div
              ref={imageScrollRef}
              tabIndex={0}
              role="group"
              aria-label="BCS参考図（スクロールして拡大部分を確認）"
              onKeyDown={onImageKeyDown}
              className="mt-3 max-h-[calc(100vh-11rem)] overflow-auto rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2"
            >
              <ResponsiveImage
                src="/bcs/env-cat-bcs-chart.webp"
                alt={text.ALT}
                width={1400}
                height={833}
                sizes="(max-width: 1536px) 100vw, 1400px"
                className="h-auto w-[900px] max-w-none"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
