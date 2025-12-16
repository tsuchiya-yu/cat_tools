import type { CatFoodItem } from '@/types';
import { isCatFoodItem } from '@/lib/catFoodValidation';
import rawCatFoods from '../../public/data/cat_foods.json';
import {
  createNormalizedFoods,
  searchNormalizedFoods,
  stripNormalizedFood,
  type NormalizedCatFood,
} from '@/lib/catFoodSearch';

let catFoodDataset: NormalizedCatFood[] | undefined;

function loadDataset(): NormalizedCatFood[] {
  if (!catFoodDataset) {
    const rawFoods: unknown = rawCatFoods;
    if (!Array.isArray(rawFoods) || rawFoods.some((food) => !isCatFoodItem(food))) {
      throw new Error('Invalid data structure detected in cat_foods.json');
    }
    catFoodDataset = createNormalizedFoods(rawFoods as CatFoodItem[]);
  }
  return catFoodDataset;
}

export function searchCatFood(name: string) {
  return searchNormalizedFoods(loadDataset(), name);
}

export function getAllCatFoods(): CatFoodItem[] {
  return loadDataset().map(stripNormalizedFood);
}
