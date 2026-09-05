"use client";

import React from "react";
import {
  calcGramsPerDay,
  calcMultiFoodGrams,
  calcTotalKcalFromGrams,
  normalizeNumberInput,
  roundGrams1,
  splitMorningNight,
  splitMorningNightTenths,
  type FoodRatioInput,
} from "@/lib/feed";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeedingFAQ from "@/components/FeedingFAQ";
import GuideSection from "@/components/GuideSection";
import ShareMenu from "@/components/ShareMenu";
import { FEEDING_UI_TEXT, FEEDING_RANGE } from "@/constants/text";
import { CAT_MEAL_MANAGEMENT_PATH } from "@/constants/paths";
import { useRouter } from "next/navigation";

const FEEDING_PATH = "/calculate-cat-feeding";
const MAX_FOODS = 5;
const FOOD_NAME_MAX_LENGTH = 50;

type FoodItem = {
  id: string;
  name: string;
  density: string;
  ratioGrams: string;
};

type FeedingInputGroupProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  help: React.ReactNode;
  warnText: string;
  helpId?: string;
  warnId?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

function createFoodId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `food-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createEmptyFood(density = "", name = ""): FoodItem {
  return {
    id: createFoodId(),
    name,
    density,
    ratioGrams: "",
  };
}

function defaultFoodName(index: number): string {
  return FEEDING_UI_TEXT.MULTI_FOOD.FALLBACK_NAME(index);
}

function withDefaultFoodNames(foods: FoodItem[]): FoodItem[] {
  if (foods.length < 2) return foods;
  return foods.map((food, index) => ({
    ...food,
    name: food.name.trim() || defaultFoodName(index + 1),
  }));
}

function parseFoodsFromSearchParams(params: URLSearchParams): FoodItem[] {
  const foods: FoodItem[] = [
    {
      id: createFoodId(),
      name: params.get("n1") ?? "",
      density: params.get("d") ?? "",
      ratioGrams: params.get("g1") ?? "",
    },
  ];

  for (let i = 2; i <= MAX_FOODS; i += 1) {
    const hasDensity = params.has(`d${i}`);
    const hasRatio = params.has(`g${i}`);
    const hasName = params.has(`n${i}`);
    if (!hasDensity && !hasRatio && !hasName) continue;

    foods.push({
      id: createFoodId(),
      name: params.get(`n${i}`) ?? "",
      density: params.get(`d${i}`) ?? "",
      ratioGrams: params.get(`g${i}`) ?? "",
    });
  }

  return withDefaultFoodNames(foods);
}

function buildFeedingPath(dailyKcal: string, foods: FoodItem[]): string {
  const params = new URLSearchParams();
  if (dailyKcal) params.set("kcal", dailyKcal);

  const first = foods[0];
  if (first?.density) params.set("d", first.density);

  if (foods.length >= 2) {
    if (first?.ratioGrams) params.set("g1", first.ratioGrams);
    const trimmedName = first?.name.trim() ?? "";
    if (trimmedName) params.set("n1", trimmedName);

    for (let i = 1; i < foods.length; i += 1) {
      const food = foods[i];
      const index = i + 1;
      if (food.density) params.set(`d${index}`, food.density);
      if (food.ratioGrams) params.set(`g${index}`, food.ratioGrams);
      const name = food.name.trim();
      if (name) params.set(`n${index}`, name);
    }
  }

  const queryString = params.toString();
  return queryString ? `${FEEDING_PATH}?${queryString}` : FEEDING_PATH;
}

function formatDisplayNumber(value: number): string {
  return String(value);
}

type NumberFieldWarnOptions = {
  min?: number;
  max?: number;
  rangeWarning?: (min: number, max: number) => string;
};

function numberFieldWarnText(value: string, options: NumberFieldWarnOptions = {}): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const num = normalizeNumberInput(value);
  if (num == null) {
    return FEEDING_UI_TEXT.WARNINGS.NUMBER;
  }
  if (!(num > 0)) {
    return FEEDING_UI_TEXT.WARNINGS.POSITIVE;
  }
  if (
    options.min != null &&
    options.max != null &&
    options.rangeWarning &&
    (num < options.min || num > options.max)
  ) {
    return options.rangeWarning(options.min, options.max);
  }
  return "";
}

function densityWarnTextFor(value: string): string {
  return numberFieldWarnText(value, {
    min: FEEDING_RANGE.density.min,
    max: FEEDING_RANGE.density.max,
    rangeWarning: FEEDING_UI_TEXT.WARNINGS.DENSITY_RANGE,
  });
}

function ratioWarnTextFor(value: string): string {
  return numberFieldWarnText(value);
}

function FeedingInputGroup({
  id,
  label,
  placeholder,
  value,
  onChange,
  help,
  warnText,
  helpId,
  warnId,
  maxLength,
  inputMode = "decimal",
}: FeedingInputGroupProps) {
  const resolvedHelpId = helpId ?? `${id}Help`;
  const resolvedWarnId = warnId ?? `${id}Warn`;
  const hasHelp = Boolean(help);
  const hasWarn = Boolean(warnText);
  const describedBy = [hasHelp ? resolvedHelpId : null, resolvedWarnId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-bold text-gray-900">{label}</label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={describedBy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
      />
      {hasHelp ? (
        <div id={resolvedHelpId} className="text-xs text-gray-500">
          {help}
        </div>
      ) : null}
      <div
        id={resolvedWarnId}
        className={hasWarn ? "text-red-700 text-xs mt-1.5" : "sr-only"}
        aria-live="polite"
      >
        {warnText}
      </div>
    </div>
  );
}

function FeedingSupplementaryContent() {
  const supplementaryText = FEEDING_UI_TEXT.SUPPLEMENTARY;

  return (
    <>
      <section className="section mt-10" aria-labelledby="feeding-basics">
        <h2
          id="feeding-basics"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.BASICS.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.BASICS.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.BASICS.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-formula">
        <h2
          id="feeding-formula"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.FORMULA.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.FORMULA.INTRO}
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <p className="text-base font-bold text-gray-900 leading-relaxed text-balance">
            {supplementaryText.FORMULA.EQUATION}
          </p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty mt-5">
          {supplementaryText.FORMULA.EXAMPLE}
        </p>
        <div className="space-y-3 mt-5">
          {supplementaryText.FORMULA.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-multi-food">
        <h2
          id="feeding-multi-food"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.MULTI_FOOD.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.MULTI_FOOD.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-conditions">
        <h2
          id="feeding-conditions"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.CONDITIONS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.CONDITIONS.INTRO}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:grid sm:grid-cols-2">
          {supplementaryText.CONDITIONS.ITEMS.map((item) => (
            <article key={item.TITLE} className="h-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY.join(' ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-adjustment">
        <h2
          id="feeding-adjustment"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.ADJUSTMENT.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.ADJUSTMENT.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-5 space-y-6">
          {supplementaryText.ADJUSTMENT.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.ADJUSTMENT.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-food-types">
        <h2
          id="feeding-food-types"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.FOOD_TYPES.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.FOOD_TYPES.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-5 space-y-6">
          {supplementaryText.FOOD_TYPES.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-examples">
        <h2
          id="feeding-examples"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.EXAMPLES.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.EXAMPLES.INTRO}
        </p>
        <div className="mt-5 space-y-6">
          {supplementaryText.EXAMPLES.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-related-tools">
        <h2
          id="feeding-related-tools"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.RELATED_TOOLS.TITLE}
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.RELATED_TOOLS.INTRO_BEFORE_LINK}
            <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold">
              {FEEDING_UI_TEXT.LINKS.CALORIE_PAGE}
            </Link>
            {supplementaryText.RELATED_TOOLS.INTRO_AFTER_LINK}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.RELATED_TOOLS.BODY}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            カロリー計算や給水量計算を含めた食事管理全体の進め方は、
            <Link href={CAT_MEAL_MANAGEMENT_PATH} className="text-pink-600 font-bold">
              猫の食事管理ガイド
            </Link>
            で詳しく解説しています。
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-references">
        <h2
          id="feeding-references"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.REFERENCES.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.REFERENCES.BODY.map((paragraph, index) => (
            <p key={`feeding-reference-body-${index}`} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {supplementaryText.REFERENCES.LINKS.map((source) => (
            <li key={source.URL}>
              <a
                href={source.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
              >
                {source.LABEL}
              </a>
              <span className="text-gray-600"> — {source.NOTE}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

type CatFeedingCalculatorProps = {
  initialKcal?: string;
  initialDensity?: string;
};

export default function CatFeedingCalculator({ initialKcal = "", initialDensity = "" }: CatFeedingCalculatorProps) {
  const router = useRouter();
  const [dailyKcal, setDailyKcal] = React.useState<string>(initialKcal);
  const [foods, setFoods] = React.useState<FoodItem[]>(() => [createEmptyFood(initialDensity)]);
  const isMulti = foods.length >= 2;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromLocation = () => {
      const url = new URL(window.location.href);
      setDailyKcal(url.searchParams.get("kcal") ?? "");
      setFoods(parseFoodsFromSearchParams(url.searchParams));
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  const pathWithQuery = React.useMemo(
    () => buildFeedingPath(dailyKcal, foods),
    [dailyKcal, foods],
  );

  const syncUrl = React.useCallback(
    (nextDailyKcal: string, nextFoods: FoodItem[]) => {
      const nextPath = buildFeedingPath(nextDailyKcal, nextFoods);
      if (!nextPath || nextPath === pathWithQuery) return;
      router.replace(nextPath, { scroll: false });
    },
    [pathWithQuery, router],
  );

  const handleDailyKcalChange = React.useCallback(
    (value: string) => {
      setDailyKcal(value);
      syncUrl(value, foods);
    },
    [syncUrl, foods],
  );

  const handleAddFood = React.useCallback(() => {
    if (foods.length >= MAX_FOODS) return;
    const nextIndex = foods.length + 1;
    const next = withDefaultFoodNames([
      ...foods,
      createEmptyFood("", defaultFoodName(nextIndex)),
    ]);
    setFoods(next);
    syncUrl(dailyKcal, next);
  }, [dailyKcal, foods, syncUrl]);

  const handleRemoveFood = React.useCallback(
    (index: number) => {
      if (foods.length <= 1) return;
      const next = foods.filter((_, i) => i !== index);
      setFoods(next);
      syncUrl(dailyKcal, next);
    },
    [dailyKcal, foods, syncUrl],
  );

  const handleFoodFieldChange = React.useCallback(
    (index: number, field: keyof Omit<FoodItem, "id">, value: string) => {
      const next = foods.map((food, i) => (i === index ? { ...food, [field]: value } : food));
      setFoods(next);
      syncUrl(dailyKcal, next);
    },
    [dailyKcal, foods, syncUrl],
  );

  const kcalNum = React.useMemo(() => normalizeNumberInput(dailyKcal), [dailyKcal]);
  const hasKcalInput = React.useMemo(() => dailyKcal.trim() !== "", [dailyKcal]);

  const kcalWarnText = React.useMemo(
    () =>
      numberFieldWarnText(dailyKcal, {
        min: FEEDING_RANGE.kcal.min,
        max: FEEDING_RANGE.kcal.max,
        rangeWarning: FEEDING_UI_TEXT.WARNINGS.KCAL_RANGE,
      }),
    [dailyKcal],
  );

  const singleDensity = foods[0]?.density ?? "";
  const singleDensityNum = React.useMemo(() => normalizeNumberInput(singleDensity), [singleDensity]);
  const hasSingleDensityInput = singleDensity.trim() !== "";

  const singleGramsRaw = React.useMemo(() => {
    if (isMulti) return undefined;
    if (kcalNum == null || singleDensityNum == null) return undefined;
    if (!(kcalNum > 0) || !(singleDensityNum > 0)) return undefined;
    return calcGramsPerDay(kcalNum, singleDensityNum);
  }, [isMulti, kcalNum, singleDensityNum]);

  const singleSplit = React.useMemo(
    () => (singleGramsRaw != null ? splitMorningNight(singleGramsRaw) : undefined),
    [singleGramsRaw],
  );

  const multiInputs = React.useMemo((): FoodRatioInput[] | undefined => {
    if (!isMulti) return undefined;
    const parsed: FoodRatioInput[] = [];
    for (const food of foods) {
      const densityNum = normalizeNumberInput(food.density);
      const ratioNum = normalizeNumberInput(food.ratioGrams);
      if (densityNum == null || ratioNum == null) return undefined;
      if (!(densityNum > 0) || !(ratioNum > 0)) return undefined;
      parsed.push({ kcalPer100g: densityNum, ratioGrams: ratioNum });
    }
    return parsed;
  }, [foods, isMulti]);

  const multiResults = React.useMemo(() => {
    if (!isMulti || kcalNum == null || multiInputs == null) return undefined;
    return calcMultiFoodGrams(kcalNum, multiInputs);
  }, [isMulti, kcalNum, multiInputs]);

  const multiDisplay = React.useMemo(() => {
    if (!multiResults || !multiInputs) return undefined;
    const items = multiResults.map((result, index) => {
      const split = splitMorningNightTenths(result.gramsPerDay);
      const rawName = foods[index]?.name.trim() ?? "";
      return {
        name: rawName || FEEDING_UI_TEXT.MULTI_FOOD.FALLBACK_NAME(index + 1),
        ...split,
      };
    });
    const totalGramsRaw = multiResults.reduce((sum, item) => sum + item.gramsPerDay, 0);
    const totalKcalRaw = calcTotalKcalFromGrams(multiInputs, multiResults);
    if (totalKcalRaw == null) return undefined;
    return {
      items,
      totalGrams: roundGrams1(totalGramsRaw),
      totalKcal: roundGrams1(totalKcalRaw),
    };
  }, [foods, multiInputs, multiResults]);

  const shareUrl = React.useMemo(() => {
    if (!pathWithQuery || typeof window === "undefined") return "";
    return `${window.location.origin}${pathWithQuery}`;
  }, [pathWithQuery]);

  const atMaxFoods = foods.length >= MAX_FOODS;

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      <Breadcrumbs
        items={[
          { label: FEEDING_UI_TEXT.BREADCRUMBS.HOME, href: "/" },
          { label: FEEDING_UI_TEXT.BREADCRUMBS.FEEDING_CALCULATOR },
        ]}
        className="mt-4"
      />

      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          {FEEDING_UI_TEXT.HEADER.EYECATCH}
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">{FEEDING_UI_TEXT.HEADER.TITLE}</h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          {FEEDING_UI_TEXT.HEADER.DESCRIPTION}
        </p>

        <div className="surface border-none overflow-hidden border-b border-gray-200">
          <div className="row flex flex-col gap-4">
            <FeedingInputGroup
              id="kcalInput"
              label="1日の必要カロリー（kcal）"
              placeholder="例：230"
              value={dailyKcal}
              onChange={handleDailyKcalChange}
              help={
                <>
                  必要カロリーが分からない方は
                  <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold ml-1">
                    {FEEDING_UI_TEXT.LINKS.CALORIE_TOOL}
                  </Link>
                </>
              }
              warnText={kcalWarnText}
              helpId="kcalHelp"
              warnId="kcalWarn"
            />

            {!isMulti ? (
              <FeedingInputGroup
                id="densityInput"
                label="フードのカロリー（kcal/100g）"
                placeholder="例：390"
                value={singleDensity}
                onChange={(value) => handleFoodFieldChange(0, "density", value)}
                help="パッケージの「代謝エネルギー（kcal/100g）」を入力してください"
                warnText={densityWarnTextFor(singleDensity)}
                helpId="densityHelp"
                warnId="densityWarn"
              />
            ) : (
              <div className="flex flex-col gap-10">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {FEEDING_UI_TEXT.MULTI_FOOD.RATIO_HELP}
                </p>
                {foods.map((food, index) => {
                  const foodNumber = index + 1;
                  const nameId = `foodName-${food.id}`;
                  const densityId = index === 0 ? "densityInput" : `densityInput-${food.id}`;
                  const ratioId = `ratioInput-${food.id}`;
                  const densityHelpId = `${densityId}Help`;
                  const densityWarnId = `${densityId}Warn`;
                  const ratioHelpId = `${ratioId}Help`;
                  const ratioWarnId = `${ratioId}Warn`;

                  return (
                    <fieldset
                      key={food.id}
                      className="flex flex-col gap-3 border-0 p-0 m-0"
                      data-testid={`food-group-${foodNumber}`}
                    >
                      <legend className="mb-2 text-2xl font-extrabold text-gray-900 px-0">
                        {FEEDING_UI_TEXT.MULTI_FOOD.FOOD_HEADING(foodNumber)}
                      </legend>

                      <FeedingInputGroup
                        id={nameId}
                        label={FEEDING_UI_TEXT.MULTI_FOOD.NAME_LABEL}
                        placeholder={FEEDING_UI_TEXT.MULTI_FOOD.NAME_PLACEHOLDER}
                        value={food.name}
                        onChange={(value) => handleFoodFieldChange(index, "name", value)}
                        help=""
                        warnText=""
                        helpId={`${nameId}Help`}
                        warnId={`${nameId}Warn`}
                        maxLength={FOOD_NAME_MAX_LENGTH}
                        inputMode="text"
                      />

                      <FeedingInputGroup
                        id={densityId}
                        label={FEEDING_UI_TEXT.MULTI_FOOD.DENSITY_LABEL}
                        placeholder="例：390"
                        value={food.density}
                        onChange={(value) => handleFoodFieldChange(index, "density", value)}
                        help="パッケージの「代謝エネルギー（kcal/100g）」を入力してください"
                        warnText={densityWarnTextFor(food.density)}
                        helpId={densityHelpId}
                        warnId={densityWarnId}
                      />

                      <FeedingInputGroup
                        id={ratioId}
                        label={FEEDING_UI_TEXT.MULTI_FOOD.RATIO_LABEL}
                        placeholder="例：40"
                        value={food.ratioGrams}
                        onChange={(value) => handleFoodFieldChange(index, "ratioGrams", value)}
                        help="比率の目安として入力してください。最終給餌量そのものではありません。"
                        warnText={ratioWarnTextFor(food.ratioGrams)}
                        helpId={ratioHelpId}
                        warnId={ratioWarnId}
                      />

                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFood(index)}
                          className="text-sm text-pink-700 underline underline-offset-2 hover:text-pink-800"
                          aria-label={FEEDING_UI_TEXT.MULTI_FOOD.DELETE_LABEL(foodNumber)}
                        >
                          {FEEDING_UI_TEXT.MULTI_FOOD.DELETE_LABEL(foodNumber)}
                        </button>
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-2 pb-4">
              <button
                type="button"
                id="addFoodBtn"
                onClick={handleAddFood}
                disabled={atMaxFoods}
                className="self-start rounded-lg border-2 border-pink-300 bg-white px-4 py-2 text-sm font-bold text-pink-700 hover:bg-pink-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
              >
                {FEEDING_UI_TEXT.MULTI_FOOD.ADD_BUTTON}
              </button>
              {atMaxFoods && (
                <p id="maxFoodHint" className="text-xs text-gray-500">
                  {FEEDING_UI_TEXT.MULTI_FOOD.MAX_HINT}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {!isMulti && hasKcalInput && hasSingleDensityInput && (
        <section className="section mt-6" aria-live="polite">
          <div className="relative pt-6 pb-4 border-b border-gray-200">
            <div className="text-gray-600 text-[12px] tracking-[0.04em]">{FEEDING_UI_TEXT.RESULT.TITLE}</div>
            <div className="text-center mt-2">
              <span id="dailyGram" className="numeral tracking-[-.01em] text-5xl md:text-6xl font-extrabold text-pink-600">
                {singleSplit ? String(singleSplit.totalInt) : "--"}
              </span>
              <span className="text-[18px] md:text-[20px] text-gray-900 relative -top-2 md:-top-3 ml-1">g</span>
            </div>

            <div id="perMeal" className="text-center mt-2 text-[16px] font-bold text-gray-900">
              {singleSplit ? `朝 ${singleSplit.morning} g / 夜 ${singleSplit.night} g` : "朝 -- g / 夜 -- g"}
            </div>
            <div id="note" className="text-center mt-2 text-xs text-gray-500">{FEEDING_UI_TEXT.RESULT.NOTE}</div>

            {singleSplit && (
              <ShareMenu
                shareText={FEEDING_UI_TEXT.SHARE.TEXT(singleSplit.totalInt, singleSplit.morning, singleSplit.night)}
                shareUrl={shareUrl}
                shareTitle={FEEDING_UI_TEXT.HEADER.TITLE}
                xHashtags={FEEDING_UI_TEXT.SHARE.X_HASHTAGS}
                buttonId="shareBtn"
                menuId="shareMenu"
                buttonClassName="absolute right-0 top-0 -translate-y-3/5"
                menuClassName="top-12 border-gray-300 min-w-[220px]"
              />
            )}
          </div>
        </section>
      )}

      {isMulti && hasKcalInput && multiDisplay && (
        <section className="section mt-6" aria-live="polite" data-testid="multi-food-result">
          <div className="relative pt-6 pb-4 border-b border-gray-200">
            <div className="text-gray-600 text-[12px] tracking-[0.04em]">{FEEDING_UI_TEXT.RESULT.MULTI_TITLE}</div>
            <div className="text-center mt-2">
              <div className="text-sm text-gray-600">合計</div>
              <div className="mt-1">
                <span
                  id="multiTotalGrams"
                  className="numeral tracking-[-.01em] text-5xl md:text-6xl font-extrabold text-pink-600"
                >
                  {formatDisplayNumber(multiDisplay.totalGrams)}
                </span>
                <span className="text-[18px] md:text-[20px] text-gray-900 relative -top-2 md:-top-3 ml-1">g</span>
              </div>
            </div>
            <div id="multiTotalKcal" className="text-center mt-2 text-[16px] font-bold text-gray-900">
              {FEEDING_UI_TEXT.MULTI_FOOD.TOTAL_KCAL(formatDisplayNumber(multiDisplay.totalKcal))}
            </div>

            <div className="mt-6 space-y-5">
              {multiDisplay.items.map((item, index) => (
                <div
                  key={foods[index]?.id ?? `result-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                  data-testid={`food-result-${index + 1}`}
                >
                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm text-gray-800">
                    {FEEDING_UI_TEXT.MULTI_FOOD.DAY_AMOUNT(formatDisplayNumber(item.total))}
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {FEEDING_UI_TEXT.MULTI_FOOD.MORNING_AMOUNT(formatDisplayNumber(item.morning))}
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {FEEDING_UI_TEXT.MULTI_FOOD.NIGHT_AMOUNT(formatDisplayNumber(item.night))}
                  </p>
                </div>
              ))}
            </div>

            <div id="multiNote" className="text-center mt-4 text-xs text-gray-500">
              {FEEDING_UI_TEXT.RESULT.MULTI_NOTE}
            </div>
            <p className="mt-3 text-xs text-gray-600 leading-relaxed text-pretty">
              {FEEDING_UI_TEXT.RESULT.MULTI_SAFETY}
            </p>

            <ShareMenu
              shareText={FEEDING_UI_TEXT.SHARE.MULTI_TEXT(
                formatDisplayNumber(multiDisplay.totalGrams),
                formatDisplayNumber(multiDisplay.totalKcal),
              )}
              shareUrl={shareUrl}
              shareTitle={FEEDING_UI_TEXT.HEADER.TITLE}
              xHashtags={FEEDING_UI_TEXT.SHARE.X_HASHTAGS}
              buttonId="shareBtn"
              menuId="shareMenu"
              buttonClassName="absolute right-0 top-0 -translate-y-3/5"
              menuClassName="top-12 border-gray-300 min-w-[220px]"
            />
          </div>
        </section>
      )}

      <FeedingSupplementaryContent />

      <FeedingFAQ />

      <GuideSection
        className="mt-8"
        whatTitle={FEEDING_UI_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={FEEDING_UI_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={FEEDING_UI_TEXT.GUIDE.USAGE_TITLE}
        usageItems={FEEDING_UI_TEXT.GUIDE.USAGE_ITEMS}
      />

      <section className="section mt-8" aria-label="免責事項">
        <p className="text-sm text-gray-600 leading-relaxed text-pretty">
          {FEEDING_UI_TEXT.SUPPLEMENTARY.DISCLAIMER}
        </p>
      </section>
    </main>
  );
}
