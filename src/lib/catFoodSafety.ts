import type { CatFoodItem } from '@/types';
import { isCatFoodItem } from '@/lib/catFoodValidation';

type NormalizedFood = CatFoodItem & {
  normalizedNames: string[];
};

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;
const SPLIT_PATTERN = /[・,，、／\/＆&\s]+/g;
const REMOVE_PATTERN = /[\s\u3000・,，、／\/＆&\-\(\)（）「」『』【】［］\[\]{}<>＜＞]/g;

let catFoodDataset: NormalizedFood[] | undefined;

async function loadDataset(): Promise<NormalizedFood[]> {
  if (catFoodDataset) {
    return catFoodDataset;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/data/cat_foods.json`, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error('Failed to load cat food dataset');
  }
  const rawFoods: unknown = await response.json();

  if (!Array.isArray(rawFoods) || rawFoods.some((food) => !isCatFoodItem(food))) {
    throw new Error('Invalid data structure detected in cat_foods.json');
  }

  const normalized = (rawFoods as CatFoodItem[]).map((food) => ({
    ...food,
    normalizedNames: buildNormalizedNames(food.name),
  }));
  catFoodDataset = normalized;
  return normalized;
}

function stripNormalized(food: NormalizedFood): CatFoodItem {
  return {
    name: food.name,
    status: food.status,
    description: food.description,
    notes: food.notes,
  };
}

function katakanaToHiragana(value: string) {
  return value.replace(/[\u30a1-\u30f6]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code < KATAKANA_START || code > KATAKANA_END) return char;
    return String.fromCharCode(code - KATAKANA_TO_HIRAGANA_OFFSET);
  });
}

function normalizeValue(value: string) {
  return katakanaToHiragana(
    value
      .trim()
      .normalize('NFKC')
      .toLowerCase()
  ).replace(REMOVE_PATTERN, '');
}

function buildNormalizedNames(name: string) {
  const normalizedFull = normalizeValue(name);
  const segments = name
    .split(SPLIT_PATTERN)
    .map((segment) => normalizeValue(segment))
    .filter(Boolean);

  return Array.from(new Set([normalizedFull, ...segments]));
}

export async function searchCatFood(name: string) {
  const dataset = await loadDataset();
  const normalizedQuery = normalizeValue(name);
  if (!normalizedQuery) {
    return [];
  }

  const matches = dataset.filter((food) =>
    food.normalizedNames.some((value) => value.includes(normalizedQuery))
  );

  return matches.map(stripNormalized);
}

export async function getAllCatFoods(): Promise<CatFoodItem[]> {
  const dataset = await loadDataset();
  return dataset.map(stripNormalized);
}
