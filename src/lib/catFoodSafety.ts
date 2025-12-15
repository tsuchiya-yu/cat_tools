import type { CatFoodItem } from '@/types';
import rawCatFoods from '@/../public/data/cat_foods.json';

type NormalizedFood = CatFoodItem & {
  normalizedNames: string[];
};

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;
const SPLIT_PATTERN = /[・,，、／/＆&\s]+/g;
const REMOVE_PATTERN = /[\s\u3000・,，、／/＆&\-\(\)（）「」『』【】［］\[\]{}<>＜＞]/g;

const catFoodDataset: NormalizedFood[] = (rawCatFoods as CatFoodItem[]).map((food) => ({
  ...food,
  normalizedNames: buildNormalizedNames(food.name),
}));

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
      .toLowerCase()
      .normalize('NFKC')
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

export function searchCatFood(name: string) {
  const normalizedQuery = normalizeValue(name);
  if (!normalizedQuery) {
    return [];
  }

  const matches = catFoodDataset.filter((food) =>
    food.normalizedNames.some((value) => value.includes(normalizedQuery))
  );

  return matches.map(stripNormalized);
}

export function getAllCatFoods(): CatFoodItem[] {
  return catFoodDataset.map(stripNormalized);
}
