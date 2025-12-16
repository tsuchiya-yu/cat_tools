import { readFile } from 'fs/promises';
import path from 'path';
import type { CatFoodItem } from '@/types';

type NormalizedFood = CatFoodItem & {
  normalizedNames: string[];
};

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;
const SPLIT_PATTERN = /[・,，、／/＆&\s]+/g;
const REMOVE_PATTERN = /[\s\u3000・,，、／/＆&\-\(\)（）「」『』【】［］\[\]{}<>＜＞]/g;

let catFoodDataset: NormalizedFood[] | null = null;
let datasetPromise: Promise<NormalizedFood[]> | null = null;

async function loadDataset(): Promise<NormalizedFood[]> {
  if (catFoodDataset) {
    return catFoodDataset;
  }

  if (!datasetPromise) {
    datasetPromise = (async () => {
      const filePath = path.join(process.cwd(), 'public', 'data', 'cat_foods.json');
      const fileContent = await readFile(filePath, 'utf-8');
      const rawFoods = JSON.parse(fileContent) as CatFoodItem[];
      const normalized = rawFoods.map((food) => ({
        ...food,
        normalizedNames: buildNormalizedNames(food.name),
      }));
      catFoodDataset = normalized;
      return normalized;
    })();
  }

  return datasetPromise;
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
