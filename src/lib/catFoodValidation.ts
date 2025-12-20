import type { CatFoodItem, CatFoodSafetyStatus, CatFoodSearchResponse } from '@/types';

export const VALID_CAT_FOOD_STATUSES: ReadonlyArray<CatFoodSafetyStatus> = ['安全', '注意', '危険'];

export function isCatFoodItem(value: unknown): value is CatFoodItem {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.name === 'string' &&
    typeof record.description === 'string' &&
    typeof record.notes === 'string' &&
    typeof record.status === 'string' &&
    VALID_CAT_FOOD_STATUSES.includes(record.status as CatFoodSafetyStatus)
  );
}

export function isCatFoodSearchResponse(value: unknown): value is CatFoodSearchResponse {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.results) || record.results.some((item) => !isCatFoodItem(item))) {
    return false;
  }
  if (record.error !== undefined && typeof record.error !== 'string') {
    return false;
  }
  return true;
}
