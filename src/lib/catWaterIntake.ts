export type WaterIntakeInput = {
  weightKg: number;
  dryFoodG?: number;
  wetFoodG?: number;
};

export type WaterIntakeRange = {
  min: number;
  mid: number;
  max: number;
};

export type CatWaterIntakeResult = {
  totalWaterMl: WaterIntakeRange;
  foodWaterMl: number;
  drinkTargetMl: WaterIntakeRange;
};

const DRY_FOOD_WATER_RATIO = 0.10;
const WET_FOOD_WATER_RATIO = 0.78;

export function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function formatMl(value: number) {
  const rounded = round1(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function calculateCatWaterIntake({
  weightKg,
  dryFoodG = 0,
  wetFoodG = 0,
}: WaterIntakeInput): CatWaterIntakeResult {
  if (!(weightKg > 0)) {
    throw new Error('weight must be > 0');
  }
  if (dryFoodG < 0) {
    throw new Error('dryFoodG must be >= 0');
  }
  if (wetFoodG < 0) {
    throw new Error('wetFoodG must be >= 0');
  }

  const totalWaterMl = {
    min: round1(weightKg * 40),
    mid: round1(weightKg * 50),
    max: round1(weightKg * 60),
  };

  const foodWaterMl = round1(dryFoodG * DRY_FOOD_WATER_RATIO + wetFoodG * WET_FOOD_WATER_RATIO);

  const drinkTargetMl = {
    min: round1(Math.max(0, totalWaterMl.min - foodWaterMl)),
    mid: round1(Math.max(0, totalWaterMl.mid - foodWaterMl)),
    max: round1(Math.max(0, totalWaterMl.max - foodWaterMl)),
  };

  return {
    totalWaterMl,
    foodWaterMl,
    drinkTargetMl,
  };
}
