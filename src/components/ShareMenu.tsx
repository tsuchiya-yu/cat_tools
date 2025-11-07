'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SHARE_UI_TEXT } from '@/constants/text';
import { IoShareOutline, IoLinkOutline } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';

interface ShareMenuProps {
  shareText: string;
  shareUrl?: string;
  shareTitle?: string;
  buttonClassName?: string;
  menuClassName?: string;
  buttonId?: string;
  menuId?: string;
}

const TOAST_DURATION_MS = 1600;
const BUTTON_BASE_CLASS =
  'share-btn w-10 h-10 rounded-full border border-gray-300 bg-white inline-grid place-items-center cursor-pointer hover:border-gray-400';
const MENU_BASE_CLASS =
  'share-menu absolute right-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 min-w-[200px]';

export default function ShareMenu({
  shareText,
  shareUrl,
  shareTitle,
  buttonClassName,
  menuClassName,
  buttonId,
  menuId,
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const resolvedShareUrl = useMemo(() => {
    if (shareUrl) return shareUrl;
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, [shareUrl]);

  const resolvedShareTitle = shareTitle ?? 'ねこツールズ';

  const toggleShare = useCallback((open?: boolean) => {
    setIsOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const xShareUrl = useMemo(() => {
    const params = new URLSearchParams({ text: shareText });
    if (resolvedShareUrl) {
      params.set('url', resolvedShareUrl);
    }
    return `https://x.com/intent/post?${params.toString()}`;
  }, [shareText, resolvedShareUrl]);

  const handleShare = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('share' in navigator)) {
      toggleShare(false);
      return;
    }

    try {
      await navigator.share({
        title: resolvedShareTitle,
        text: shareText,
        url: resolvedShareUrl || undefined,
      });
    } catch {
      // ignore cancellation
    } finally {
      toggleShare(false);
    }
  }, [resolvedShareTitle, shareText, resolvedShareUrl, toggleShare]);

  const handleCopyLink = useCallback(async () => {
    const target = resolvedShareUrl;

    if (!target) {
      setToastMessage(SHARE_UI_TEXT.TOAST.ERROR);
      setShowToast(true);
      toggleShare(false);
      return;
    }

    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(target);
      setToastMessage(SHARE_UI_TEXT.TOAST.SUCCESS);
    } catch {
      setToastMessage(SHARE_UI_TEXT.TOAST.ERROR);
    } finally {
      setShowToast(true);
      toggleShare(false);
    }
  }, [resolvedShareUrl, toggleShare]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('.share-menu') && !event.target.closest('.share-btn')) {
        toggleShare(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
  }, [isOpen, toggleShare]);

  useEffect(() => {
    if (!showToast) return;
    const timerId = window.setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [showToast]);

  const buttonClasses = [BUTTON_BASE_CLASS, buttonClassName].filter(Boolean).join(' ');
  const menuClasses = [MENU_BASE_CLASS, menuClassName].filter(Boolean).join(' ');

  return (
    <>
      <button
        type="button"
        id={buttonId}
        className={buttonClasses}
        onClick={(event) => {
          event.stopPropagation();
          toggleShare();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={SHARE_UI_TEXT.BUTTON_LABEL}
      >
        <IoShareOutline className="w-5 h-5 text-gray-600" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className={menuClasses}
          role="menu"
          aria-label={SHARE_UI_TEXT.MENU_LABEL}
        >
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
              onClick={handleShare}
            >
              <IoShareOutline className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{SHARE_UI_TEXT.MENU_ITEMS.SHARE}</span>
            </button>
          )}

          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleShare(false)}
          >
            <FaXTwitter className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>{SHARE_UI_TEXT.MENU_ITEMS.X_SHARE}</span>
          </a>

          <button
            type="button"
            className="share-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 cursor-pointer hover:bg-gray-50"
            onClick={handleCopyLink}
          >
            <IoLinkOutline className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>{SHARE_UI_TEXT.MENU_ITEMS.COPY_LINK}</span>
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
