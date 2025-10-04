'use client';

import { useState, useEffect, useMemo } from 'react';
import { CALORIE_UI_TEXT } from '@/constants/text';
import { IoShareOutline } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { IoLinkOutline } from 'react-icons/io5';

interface CalorieShareMenuProps {
  kcal: string;
  range: string;
  shareUrl?: string;
}

export default function CalorieShareMenu({ kcal, range, shareUrl }: CalorieShareMenuProps) {
  const TOAST_DURATION_MS = 1600;
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const shareText = useMemo(() => {
    return CALORIE_UI_TEXT.SHARE.SHARE_TEXT(kcal, range);
  }, [kcal, range]);

  const twitterUrl = useMemo(() => {
    const currentUrl = shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
    const params = new URLSearchParams({
      url: currentUrl,
      text: shareText,
    });
    return `https://x.com/intent/post?${params.toString()}`;
  }, [shareUrl, shareText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.share-menu') && !target.closest('.share-btn')) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: '猫のカロリー計算',
          text: shareText,
          url: shareUrl ?? window.location.href,
        });
      } catch {
        // ユーザーがキャンセルした場合など、エラーは無視
      }
    }
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl ?? window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    } catch (error) {
      console.error('Failed to copy link:', error); // エラーログ出力
      // コピーに失敗した場合は何もしない
    }
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 共有ボタン */}
      <button
        id="shareBtn"
        className="share-btn absolute right-0 top-0 -translate-y-3/5 w-10 h-10 rounded-full border border-gray-300 bg-white inline-grid place-items-center cursor-pointer hover:border-gray-400"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={CALORIE_UI_TEXT.SHARE.BUTTON_LABEL}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <IoShareOutline className="w-5 h-5 text-gray-500" />
      </button>

      {/* 共有メニュー */}
      {isOpen && (
        <div
          id="shareMenu"
          className="share-menu absolute right-0 top-12 z-20 bg-white border border-gray-300 rounded-xl shadow-lg p-1.5 min-w-[220px]"
          role="menu"
          aria-label={CALORIE_UI_TEXT.SHARE.MENU_LABEL}
        >
          {/* ネイティブ共有（対応ブラウザのみ） */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 no-underline cursor-pointer hover:bg-gray-50"
              onClick={handleShare}
            >
              <IoShareOutline className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{CALORIE_UI_TEXT.SHARE.MENU_ITEMS.SHARE}</span>
            </button>
          )}

          {/* X（Twitter）でシェア */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 no-underline cursor-pointer hover:bg-gray-50"
            onClick={handleTwitterShare}
          >
            <FaXTwitter className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{CALORIE_UI_TEXT.SHARE.MENU_ITEMS.X_SHARE}</span>
          </a>

          {/* リンクをコピー */}
          <button
            className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 no-underline cursor-pointer hover:bg-gray-50"
            onClick={handleCopyLink}
          >
            <IoLinkOutline className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{CALORIE_UI_TEXT.SHARE.MENU_ITEMS.COPY_LINK}</span>
          </button>
        </div>
      )}

      {/* トースト */}
      {showToast && (
        <div className="toast fixed left-1/2 bottom-6 -translate-x-1/2 bg-gray-900 text-white text-sm px-3.5 py-2.5 rounded-lg opacity-100 pointer-events-none transition-opacity duration-300">
          {CALORIE_UI_TEXT.SHARE.TOAST.SUCCESS}
        </div>
      )}
    </>
  );
}
