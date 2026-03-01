'use client';

import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import GuideSection from '@/components/GuideSection';
import { CAT_FOOD_SAFETY_FAQ_ITEMS, CAT_FOOD_SAFETY_TEXT } from '@/constants/text';
import ShareMenu from '@/components/ShareMenu';
import type { CatFoodItem, CatFoodSafetyStatus } from '@/types';
import {
  FEATURED_CAUTION_FOOD_NAMES,
  FEATURED_DANGER_FOOD_NAMES,
  pickFeaturedCatFoods,
} from '@/lib/catFoodFeaturedContent';
import {
  createNormalizedFoods,
  searchNormalizedFoods,
  type NormalizedCatFood,
} from '@/lib/catFoodSearch';

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

type CatFoodSafetyCheckerProps = {
  allFoods: CatFoodItem[];
};

const FOOD_SAFETY_PATH = '/cat-food-safety';

export default function CatFoodSafetyChecker({ allFoods }: CatFoodSafetyCheckerProps) {
  const router = useRouter();
  const content = CAT_FOOD_SAFETY_TEXT.CONTENT;
  const suggestionsListId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatFoodItem[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<CatFoodItem[]>([]);
  const pendingQueryRef = useRef<string | undefined>(undefined);
  const normalizedFoods = useMemo<NormalizedCatFood[]>(() => createNormalizedFoods(allFoods), [allFoods]);
  const featuredDangerFoods = useMemo(
    () => pickFeaturedCatFoods(allFoods, FEATURED_DANGER_FOOD_NAMES, '危険'),
    [allFoods]
  );
  const featuredCautionFoods = useMemo(
    () => pickFeaturedCatFoods(allFoods, FEATURED_CAUTION_FOOD_NAMES, '注意'),
    [allFoods]
  );

  const resetSearchState = useCallback(() => {
    setQuery('');
    setResults([]);
    setError('');
    setHasSearched(false);
    setSuggestions([]);
  }, []);

  const syncBrowserUrl = useCallback(
    (value?: string) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('food', value);
        pendingQueryRef.current = value.trim();
      } else {
        url.searchParams.delete('food');
        pendingQueryRef.current = undefined;
      }
      router.replace(`${FOOD_SAFETY_PATH}${url.search}${url.hash}`);
    },
    [router]
  );

  const performSearch = useCallback(
    (keyword: string, options: { syncUrl?: boolean } = {}) => {
      const trimmed = keyword.trim();

      if (!trimmed) {
        setError(CAT_FOOD_SAFETY_TEXT.INPUT.ERROR.REQUIRED);
        setResults([]);
        setSuggestions([]);
        setHasSearched(false);
        if (options.syncUrl !== false) {
          syncBrowserUrl(undefined);
        }
        return;
      }

      if (trimmed.length > MAX_QUERY_LENGTH) {
        setError(CAT_FOOD_SAFETY_TEXT.INPUT.ERROR.TOO_LONG(MAX_QUERY_LENGTH));
        setResults([]);
        setSuggestions([]);
        setHasSearched(false);
        if (options.syncUrl !== false) {
          syncBrowserUrl(undefined);
        }
        return;
      }

      setHasSearched(true);
      const matches = searchNormalizedFoods(normalizedFoods, trimmed);
      setResults(matches);
      setError(matches.length ? '' : CAT_FOOD_SAFETY_TEXT.RESULT.NO_RESULTS(trimmed));
      setSuggestions([]);
      if (options.syncUrl !== false) {
        syncBrowserUrl(trimmed);
      }
    },
    [normalizedFoods, syncBrowserUrl]
  );

  const updateSuggestions = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        setSuggestions([]);
        return;
      }

      if (trimmed.length > MAX_QUERY_LENGTH) {
        setSuggestions([]);
        return;
      }

      const matches = searchNormalizedFoods(normalizedFoods, trimmed).slice(0, MAX_SUGGESTIONS);
      setSuggestions(matches);
    },
    [normalizedFoods]
  );

  useEffect(() => {
    const applyFood = (foodParam?: string) => {
      const normalizedFood = (foodParam ?? '').trim();
      if (pendingQueryRef.current !== undefined && pendingQueryRef.current === normalizedFood) {
        pendingQueryRef.current = undefined;
        return;
      }

      if (!normalizedFood) {
        setQuery('');
        resetSearchState();
        return;
      }

      setQuery(normalizedFood);
      performSearch(normalizedFood, { syncUrl: false });
    };

    if (typeof window === 'undefined') return;

    const initialFoodFromLocation = new URL(window.location.href).searchParams.get('food') ?? undefined;
    applyFood(initialFoodFromLocation);

    const handlePopState = () => {
      const url = new URL(window.location.href);
      applyFood(url.searchParams.get('food') ?? undefined);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [performSearch, resetSearchState]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(query);
  };

  const onChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setError('');
      setResults([]);
      setHasSearched(false);
      syncBrowserUrl(undefined);
      setSuggestions([]);
      return;
    }

    setError('');
    updateSuggestions(value);
  };

  const handleSuggestionSelect = useCallback(
    (name: string) => {
      setQuery(name);
      setSuggestions([]);
      performSearch(name);
    },
    [performSearch]
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
        </div>

        <form onSubmit={onSubmit} className="surface p-4 border-none rounded-2xl space-y-3" noValidate>
          <label htmlFor="food-name" className="text-sm font-semibold text-gray-700">
            {CAT_FOOD_SAFETY_TEXT.INPUT.LABEL}
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
                  className="mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg md:absolute md:left-0 md:right-0 md:z-20"
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
              className="rounded-xl bg-pink-600 text-white px-6 py-3 font-semibold hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-600"
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
                <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-4">
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

      <section className="section mt-10" aria-labelledby="cat-food-safety-emergency-title">
        <h2
          id="cat-food-safety-emergency-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.EMERGENCY.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.EMERGENCY.INTRO}</p>
        <ol className="mt-4 space-y-2 text-sm text-gray-700 leading-relaxed list-decimal pl-5">
          {content.EMERGENCY.STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="rounded-xl border border-pink-200 bg-pink-50/70 p-4 mt-5">
          <p className="text-sm text-pink-950 leading-relaxed">{content.EMERGENCY.NOTE}</p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="cat-food-safety-danger-title">
        <h2
          id="cat-food-safety-danger-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.DANGER_FOODS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.DANGER_FOODS.INTRO}</p>
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 mt-5">
          <p className="text-sm text-red-950 leading-relaxed">{content.DANGER_FOODS.NOTE}</p>
        </div>
        {featuredDangerFoods.length > 0 ? (
          <div className="grid gap-4 mt-5 md:grid-cols-2">
            {featuredDangerFoods.map((item) => {
              const styles = STATUS_STYLES[item.status] ?? STATUS_STYLES.危険;
              return (
                <article key={item.name} className={`rounded-2xl border ${styles.border} bg-white p-5 shadow-sm`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles.badge}`}
                    >
                      <span aria-hidden="true">●</span>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.description}</p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.notes}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{content.DANGER_FOODS.EMPTY}</p>
        )}
      </section>

      <section className="section mt-10" aria-labelledby="cat-food-safety-caution-title">
        <h2
          id="cat-food-safety-caution-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.CAUTION_FOODS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.CAUTION_FOODS.INTRO}</p>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 mt-5">
          <p className="text-sm text-amber-950 leading-relaxed">{content.CAUTION_FOODS.NOTE}</p>
        </div>
        {featuredCautionFoods.length > 0 ? (
          <div className="grid gap-4 mt-5 md:grid-cols-2">
            {featuredCautionFoods.map((item) => {
              const styles = STATUS_STYLES[item.status] ?? STATUS_STYLES.注意;
              return (
                <article key={item.name} className={`rounded-2xl border ${styles.border} bg-white p-5 shadow-sm`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles.badge}`}
                    >
                      <span aria-hidden="true">●</span>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.description}</p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.notes}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{content.CAUTION_FOODS.EMPTY}</p>
        )}
      </section>

      <section className="section mt-10" aria-labelledby="cat-food-safety-non-food-title">
        <h2
          id="cat-food-safety-non-food-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.NON_FOOD_HAZARDS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.NON_FOOD_HAZARDS.INTRO}</p>
        <div className="grid gap-3 mt-5 md:grid-cols-2">
          {content.NON_FOOD_HAZARDS.ITEMS.map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-sm font-medium text-gray-800">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.NON_FOOD_HAZARDS.NOTE}</p>
      </section>

      <section className="section mt-10" aria-labelledby="cat-food-safety-guide-title">
        <h2
          id="cat-food-safety-guide-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.GUIDE.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.GUIDE.INTRO}</p>
        <div className="space-y-3 mt-5">
          {content.GUIDE.STATUS_ITEMS.map((item) => {
            const styles = STATUS_STYLES[item.LABEL] ?? STATUS_STYLES.注意;
            return (
              <article key={item.LABEL} className={`rounded-xl border ${styles.border} bg-white p-4 shadow-sm`}>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles.badge}`}
                  >
                    <span aria-hidden="true">●</span>
                    {item.LABEL}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{item.DESCRIPTION}</p>
              </article>
            );
          })}
        </div>
        <ol className="mt-5 space-y-2 text-sm text-gray-700 leading-relaxed list-decimal pl-5">
          {content.GUIDE.STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">{content.GUIDE.NOTE}</p>
      </section>

      <section className="section mt-10" aria-labelledby="cat-food-safety-sources-title">
        <h2
          id="cat-food-safety-sources-title"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
        >
          {content.SOURCES.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{content.SOURCES.INTRO}</p>
        <ul className="space-y-3 mt-5">
          {content.SOURCES.LINKS.map((source) => (
            <li key={source.URL} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {source.KIND}
                </span>
                <a
                  href={source.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-pink-700 underline underline-offset-2 break-all"
                >
                  {source.LABEL}
                </a>
              </div>
              {source.NOTE && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{source.NOTE}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="section mt-10 mb-8" aria-labelledby="faqTitle">
        <h2 id="faqTitle" className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight">
          よくある質問
        </h2>
        <div>
          {CAT_FOOD_SAFETY_FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group border-none border-t border-gray-100 py-4">
              <summary className="list-none cursor-pointer flex items-center justify-between font-normal text-gray-900 hover:text-pink-600">
                {item.question}
                <svg
                  className="chev transition-transform duration-150 ease-out group-open:rotate-180"
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

      <GuideSection
        className="mt-8"
        whatTitle={CAT_FOOD_SAFETY_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={CAT_FOOD_SAFETY_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={CAT_FOOD_SAFETY_TEXT.GUIDE.USAGE_TITLE}
        usageItems={CAT_FOOD_SAFETY_TEXT.GUIDE.USAGE_ITEMS}
      />

      <section className="section mt-8" aria-label="免責事項">
        <p className="text-sm text-gray-600 leading-relaxed">{CAT_FOOD_SAFETY_TEXT.DISCLAIMER}</p>
      </section>
    </main>
  );
}
