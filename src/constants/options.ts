export const LIFE_STAGES = ['kitten', 'adult', 'senior'] as const;
export type LifeStageOption = typeof LIFE_STAGES[number];

export const GOALS = ['maintain', 'loss', 'gain'] as const;
export type GoalOption = typeof GOALS[number];

