import type { CatFoodItem } from '@/types';

export type NormalizedCatFood = CatFoodItem & {
  normalizedNames: string[];
};

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;
const SPLIT_PATTERN = /[・,，、／\/＆&\s]+/g;
const REMOVE_PATTERN = /[\s\u3000・,，、／\/＆&\-\(\)（）「」『』【】［］\[\]{}<>＜＞]/g;

function katakanaToHiragana(value: string) {
  return value.replace(/[\u30a1-\u30f6]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code < KATAKANA_START || code > KATAKANA_END) return char;
    return String.fromCharCode(code - KATAKANA_TO_HIRAGANA_OFFSET);
  });
}

export function normalizeValue(value: string) {
  return katakanaToHiragana(
    value
      .trim()
      .normalize('NFKC')
      .toLowerCase()
  ).replace(REMOVE_PATTERN, '');
}

export function buildNormalizedNames(name: string) {
  const normalizedFull = normalizeValue(name);
  const segments = name
    .split(SPLIT_PATTERN)
    .map((segment) => normalizeValue(segment))
    .filter(Boolean);

  return Array.from(new Set([normalizedFull, ...segments]));
}

export function createNormalizedFoods(foods: CatFoodItem[]): NormalizedCatFood[] {
  return foods.map((food) => ({
    ...food,
    normalizedNames: buildNormalizedNames(food.name),
  }));
}

export function stripNormalizedFood(food: NormalizedCatFood): CatFoodItem {
  return {
    name: food.name,
    status: food.status,
    description: food.description,
    notes: food.notes,
  };
}

export function searchNormalizedFoods(dataset: NormalizedCatFood[], keyword: string): CatFoodItem[] {
  const normalizedQuery = normalizeValue(keyword);
  if (!normalizedQuery) {
    return [];
  }

  return dataset
    .filter((food) => food.normalizedNames.some((value) => value.includes(normalizedQuery)))
    .map(stripNormalizedFood);
}
