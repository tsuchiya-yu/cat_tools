import type { CatFoodItem } from '@/types';
import { isCatFoodItem } from '@/lib/catFoodValidation';
import rawCatFoods from '../../public/data/cat_foods.json';
import { createNormalizedFoods, searchNormalizedFoods, type NormalizedCatFood } from '@/lib/catFoodSearch';

let validatedCatFoods: CatFoodItem[] | undefined;
let normalizedCatFoods: NormalizedCatFood[] | undefined;

function getValidatedFoods(): CatFoodItem[] {
  if (validatedCatFoods) {
    return validatedCatFoods;
  }

  const rawFoods: unknown = rawCatFoods;
  if (!Array.isArray(rawFoods) || rawFoods.some((food) => !isCatFoodItem(food))) {
    throw new Error('Invalid data structure detected in cat_foods.json');
  }

  validatedCatFoods = rawFoods as CatFoodItem[];
  return validatedCatFoods;
}

function getNormalizedFoods(): NormalizedCatFood[] {
  if (!normalizedCatFoods) {
    normalizedCatFoods = createNormalizedFoods(getValidatedFoods());
  }
  return normalizedCatFoods;
}

export function searchCatFood(name: string) {
  return searchNormalizedFoods(getNormalizedFoods(), name);
}

export function getAllCatFoods(): CatFoodItem[] {
  return getValidatedFoods();
}
