'use client';

import { useState, useEffect } from 'react';
import { UI_TEXT } from '@/constants/text';
import { IoShareOutline } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { IoLinkOutline } from 'react-icons/io5';

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
    const text = UI_TEXT.SHARE.SHARE_TEXT(humanAgeYears, humanAgeMonths);

    if (navigator.share) {
      try {
        await navigator.share({ title: UI_TEXT.HEADER.TITLE, text, url });
      } catch (e) {
        // ユーザーがキャンセルした場合など
      }
    }
    toggleShare(false);
  };

  const handleXShare = () => {
    const url = window.location.href;
    const text = UI_TEXT.SHARE.SHARE_TEXT(humanAgeYears, humanAgeMonths);
    const params = new URLSearchParams({ url, text });
    window.open(`https://x.com/intent/post?${params.toString()}`, '_blank', 'noopener');
    toggleShare(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage(UI_TEXT.SHARE.TOAST.SUCCESS);
    } catch (e) {
      showToastMessage(UI_TEXT.SHARE.TOAST.ERROR);
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
        className="share-btn absolute right-0 top-8 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 bg-white inline-grid place-items-center cursor-pointer hover:border-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          toggleShare();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={UI_TEXT.SHARE.BUTTON_LABEL}
      >
        <IoShareOutline className="w-5 h-5 text-gray-600" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="share-menu absolute right-0 top-8 -translate-y-1/10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 min-w-[200px]" role="menu" aria-label={UI_TEXT.SHARE.MENU_LABEL}>
          {navigator.share && (
            <button
              className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
              onClick={handleShare}
            >
              <IoShareOutline className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{UI_TEXT.SHARE.MENU_ITEMS.SHARE}</span>
            </button>
          )}

          <button
            className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={handleXShare}
          >
            <FaXTwitter className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>{UI_TEXT.SHARE.MENU_ITEMS.X_SHARE}</span>
          </button>

          <button
            className="share-item flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={handleCopyLink}
          >
            <IoLinkOutline className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>{UI_TEXT.SHARE.MENU_ITEMS.COPY_LINK}</span>
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
