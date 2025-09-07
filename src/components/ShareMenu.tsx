'use client';

import { useState, useEffect } from 'react';

interface ShareMenuProps {
  humanAgeYears: number;
  humanAgeMonths: number;
}

export default function ShareMenu({ humanAgeYears, humanAgeMonths }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleShare = (open?: boolean) => {
    setIsOpen(open !== undefined ? open : !isOpen);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1600);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `うちの猫の人間年齢は「${humanAgeYears}歳${humanAgeMonths}か月」でした🐾`;

    if (navigator.share) {
      try {
        await navigator.share({ title: '猫の年齢計算', text, url });
      } catch (e) {
        // ユーザーがキャンセルした場合など
      }
    }
    toggleShare(false);
  };

  const handleXShare = () => {
    const url = window.location.href;
    const text = `うちの猫の人間年齢は「${humanAgeYears}歳${humanAgeMonths}か月」でした🐾`;
    const params = new URLSearchParams({ url, text });
    window.open(`https://x.com/intent/post?${params.toString()}`, '_blank', 'noopener');
    toggleShare(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage('リンクをコピーしました');
    } catch (e) {
      showToastMessage('コピーに失敗しました');
    }
    toggleShare(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.share-menu') && !target.closest('.share-btn')) {
        toggleShare(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleShare(false);
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

  return (
    <>
      <button
        className="share-btn absolute right-0 top-2 -translate-y-3/5 w-10 h-10 rounded-full border border-gray-300 bg-white inline-grid place-items-center cursor-pointer hover:border-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          toggleShare();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="共有メニューを開く"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#69707D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
          <path d="M12 16V4"/>
          <path d="M8 8l4-4 4 4"/>
        </svg>
      </button>

      {isOpen && (
        <div className="share-menu absolute right-0 top-2 -translate-y-1/10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 min-w-[200px]" role="menu" aria-label="共有メニュー">
          {navigator.share && (
            <button
              className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
              onClick={handleShare}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                <path d="M12 16V4"/>
                <path d="M8 8l4-4 4 4"/>
              </svg>
              <span>この結果を共有</span>
            </button>
          )}

          <button
            className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={handleXShare}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.2 3h2.4l-5.2 5.9L22 21h-4.8l-3.7-7-4.2 4.8V21H4V3h5.3v7.5L18.2 3z"/>
            </svg>
            <span>Xでシェア</span>
          </button>

          <button
            className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={handleCopyLink}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 12"/>
              <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 1 1-7-7L7 12"/>
            </svg>
            <span>リンクをコピー</span>
          </button>
        </div>
      )}

      {showToast && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 bg-gray-900 text-white text-sm py-2.5 px-3.5 rounded-lg opacity-100 pointer-events-none transition-opacity duration-200">
          {toastMessage}
        </div>
      )}
    </>
  );
}
