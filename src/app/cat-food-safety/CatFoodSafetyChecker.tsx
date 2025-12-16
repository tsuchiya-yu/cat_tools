'use client';

import { FormEvent, useCallback, useEffect, useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CAT_FOOD_SAFETY_TEXT } from '@/constants/text';
import { searchCatFood } from '@/lib/catFoodSafety';
import ShareMenu from '@/components/ShareMenu';
import type { CatFoodItem, CatFoodSafetyStatus } from '@/types';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cat-tools.catnote.tokyo';
const MAX_QUERY_LENGTH = 40;
const MAX_SUGGESTIONS = 6;
const ITEM_SHARE_DESCRIPTION_LENGTH = 50;

const STATUS_STYLES: Record<CatFoodSafetyStatus, { badge: string; border: string }> = {
  安全: {
    badge: 'bg-green-100 text-green-800 border-green-200',
    border: 'border-green-200',
  },
  注意: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    border: 'border-amber-200',
  },
  危険: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    border: 'border-red-200',
  },
};

const createItemShareText = (item: CatFoodItem) => {
  const excerpt = item.description.slice(0, ITEM_SHARE_DESCRIPTION_LENGTH);
  const ellipsis = item.description.length > ITEM_SHARE_DESCRIPTION_LENGTH ? '…' : '';
  return `${item.name}（${item.status}）: ${excerpt}${ellipsis}`;
};

export default function CatFoodSafetyChecker() {
  const searchParams = useSearchParams();
  const suggestionsListId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatFoodItem[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [suggestions, setSuggestions] = useState<CatFoodItem[]>([]);

  const updateSuggestions = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const matches = searchCatFood(trimmed).slice(0, MAX_SUGGESTIONS);
    setSuggestions(matches);
  }, []);

  const syncBrowserUrl = useCallback((value: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('food', value);
    } else {
      url.searchParams.delete('food');
    }
    window.history.replaceState(null, '', url.toString());
  }, []);

  useEffect(() => {
    if (initialized) return;
    const initial = searchParams?.get('food');
    if (initial) {
      setQuery(initial);
      const initialResults = searchCatFood(initial);
      setResults(initialResults);
      setHasSearched(true);
      setError(initialResults.length ? '' : CAT_FOOD_SAFETY_TEXT.RESULT.NO_RESULTS(initial));
    }
    setInitialized(true);
  }, [searchParams, initialized]);

  const handleSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      setHasSearched(true);

      if (!trimmed) {
        setError(CAT_FOOD_SAFETY_TEXT.INPUT.ERROR.REQUIRED);
        setResults([]);
        setSuggestions([]);
        syncBrowserUrl(null);
        return;
      }

      if (trimmed.length > MAX_QUERY_LENGTH) {
        setError(CAT_FOOD_SAFETY_TEXT.INPUT.ERROR.TOO_LONG(MAX_QUERY_LENGTH));
        setResults([]);
        setSuggestions([]);
        syncBrowserUrl(null);
        return;
      }

      const matches = searchCatFood(trimmed);
      setResults(matches);
      setError(matches.length ? '' : CAT_FOOD_SAFETY_TEXT.RESULT.NO_RESULTS(trimmed));
      setSuggestions([]);
      syncBrowserUrl(trimmed);
    },
    [syncBrowserUrl]
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };

  const onChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setError('');
      setResults([]);
      setHasSearched(false);
      syncBrowserUrl(null);
      updateSuggestions('');
      return;
    }

    setError('');
    updateSuggestions(value);
  };

  const handleSuggestionSelect = useCallback(
    (name: string) => {
      setQuery(name);
      handleSearch(name);
    },
    [handleSearch]
  );

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-12">
      <Breadcrumbs
        items={[
          { label: CAT_FOOD_SAFETY_TEXT.BREADCRUMBS.HOME, href: '/' },
          { label: CAT_FOOD_SAFETY_TEXT.BREADCRUMBS.CAT_FOOD_SAFETY },
        ]}
        className="mt-4"
      />

      <section className="section mt-6 space-y-4">
        <div>
          <p className="eyebrow text-sm tracking-wider uppercase text-pink-600">
            {CAT_FOOD_SAFETY_TEXT.HEADER.EYECATCH}
          </p>
          <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
            {CAT_FOOD_SAFETY_TEXT.HEADER.TITLE}
          </h1>
          <p className="text-sm text-gray-600 mt-2.5 mb-0 leading-relaxed">
            {CAT_FOOD_SAFETY_TEXT.HEADER.DESCRIPTION}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {CAT_FOOD_SAFETY_TEXT.HEADER.NOTE}
          </p>
        </div>

        <form onSubmit={onSubmit} className="surface p-4 border-none rounded-2xl space-y-3" noValidate>
          <label htmlFor="food-name" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            {CAT_FOOD_SAFETY_TEXT.INPUT.LABEL}
            <span className="text-xs text-gray-400">{`${query.trim().length}/${MAX_QUERY_LENGTH}`}</span>
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <div
              className="relative flex-1"
              role="combobox"
              aria-haspopup="listbox"
              aria-owns={suggestions.length ? suggestionsListId : undefined}
              aria-controls={suggestions.length ? suggestionsListId : undefined}
              aria-expanded={Boolean(suggestions.length)}
            >
              <input
                id="food-name"
                name="food"
                type="text"
                value={query}
                maxLength={MAX_QUERY_LENGTH}
                onChange={(event) => onChange(event.target.value)}
                placeholder={CAT_FOOD_SAFETY_TEXT.INPUT.PLACEHOLDER}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                aria-invalid={Boolean(error)}
                aria-autocomplete="list"
                aria-controls={suggestions.length ? suggestionsListId : undefined}
                autoComplete="off"
              />
              {Boolean(suggestions.length) && (
                <ul
                  id={suggestionsListId}
                  role="listbox"
                  className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  {suggestions.map((item) => {
                    const styles = STATUS_STYLES[item.status] ?? STATUS_STYLES.注意;
                    return (
                      <li key={item.name} className="border-b border-gray-100 last:border-b-0">
                        <button
                          type="button"
                          role="option"
                          aria-selected="false"
                          aria-label={`${item.name} (${item.status})`}
                          className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm text-gray-900 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                          onClick={() => handleSuggestionSelect(item.name)}
                        >
                          <span>{item.name}</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles.badge}`}
                          >
                            <span aria-hidden="true">●</span>
                            {item.status}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="rounded-xl bg-pink-600 text-white px-6 py-3 font-semibold hover:bg-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-600"
            >
              {CAT_FOOD_SAFETY_TEXT.INPUT.BUTTON}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      <section className="section mt-8" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{CAT_FOOD_SAFETY_TEXT.RESULT.TITLE}</h2>
          {results.length > 0 && (
            <p className="text-sm text-gray-500">
              {CAT_FOOD_SAFETY_TEXT.RESULT.HIT_COUNT(results.length)}
            </p>
          )}
        </div>

        {!results.length && hasSearched && !error && (
          <p className="mt-4 text-sm text-gray-600">{CAT_FOOD_SAFETY_TEXT.RESULT.NO_RESULTS(query)}</p>
        )}

        {!hasSearched && (
          <p className="mt-4 text-sm text-gray-500">{CAT_FOOD_SAFETY_TEXT.RESULT.EMPTY}</p>
        )}

        <div className="mt-6 space-y-4">
          {results.map((item) => {
            const styles = STATUS_STYLES[item.status] ?? STATUS_STYLES.注意;
            const itemShareUrl = `${DEFAULT_BASE_URL}/cat-food-safety?food=${encodeURIComponent(item.name)}`;
            const itemShareText = createItemShareText(item);
            return (
              <article
                key={item.name}
                className={`rounded-2xl border ${styles.border} bg-white p-5 shadow-sm`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${styles.badge}`}
                  >
                    <span aria-hidden="true">●</span>
                    {item.status}
                  </span>
                </div>
                <dl className="mt-4 space-y-3 text-sm text-gray-700">
                  <div>
                    <dt className="font-semibold text-gray-900">{CAT_FOOD_SAFETY_TEXT.RESULT.DESCRIPTION_LABEL}</dt>
                    <dd className="whitespace-pre-wrap leading-relaxed mt-1">{item.description}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">{CAT_FOOD_SAFETY_TEXT.RESULT.NOTES_LABEL}</dt>
                    <dd className="whitespace-pre-wrap leading-relaxed mt-1">{item.notes}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center justify-end  pt-4">
                  <div className="relative">
                    <ShareMenu
                      shareText={itemShareText}
                      shareUrl={itemShareUrl}
                      shareTitle={item.name}
                      buttonClassName="ml-1 !static !right-auto !top-auto !translate-y-0"
                      menuClassName="top-full mt-2 right-0 !translate-y-0"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
