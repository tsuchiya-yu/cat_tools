import type { CatFoodItem, CatFoodSafetyStatus } from '@/types';

export const FEATURED_FOOD_MAX_ITEMS = 6;

export const FEATURED_DANGER_FOOD_NAMES = [
  '玉ねぎ',
  'ニンニク',
  'チョコレート',
  'コーヒー・紅茶・緑茶',
  'ぶどう・レーズン',
  'ナツメグ',
] as const;

export const FEATURED_CAUTION_FOOD_NAMES = [
  '牛乳・乳製品',
  '生肉・生魚・生卵',
  'ナッツ類（アーモンド、クルミ、ピーナッツなど）',
  'アボカド',
  'マグロ（ツナ缶）',
  'ほうれん草',
] as const;

export function pickFeaturedCatFoods(
  allFoods: readonly CatFoodItem[],
  names: readonly string[],
  expectedStatus: CatFoodSafetyStatus,
  maxItems = FEATURED_FOOD_MAX_ITEMS
): CatFoodItem[] {
  if (maxItems <= 0) {
    return [];
  }

  const foodsByName = new Map(allFoods.map((item) => [item.name, item] as const));
  const featuredFoods: CatFoodItem[] = [];

  for (const name of names) {
    if (featuredFoods.length >= maxItems) {
      break;
    }

    const item = foodsByName.get(name);
    if (!item || item.status !== expectedStatus) {
      continue;
    }

    featuredFoods.push(item);
  }

  return featuredFoods;
}
