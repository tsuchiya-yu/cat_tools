'use client';

import { LifeStage, Goal } from '@/types';
import { CALORIE_UI_TEXT } from '@/constants/text';
import SegmentedButton from './SegmentedButton';

interface CalorieInputProps {
  weight: string;
  onWeightChange: (value: string) => void;
  lifeStage: LifeStage;
  onLifeStageChange: (stage: LifeStage) => void;
  goal: Goal;
  onGoalChange: (goal: Goal) => void;
  neutered: boolean;
  onNeuteredChange: (neutered: boolean) => void;
  error: string;
}

export default function CalorieInput({
  weight,
  onWeightChange,
  lifeStage,
  onLifeStageChange,
  goal,
  onGoalChange,
  neutered,
  onNeuteredChange,
  error,
}: CalorieInputProps) {
  const showNeuteredToggle = lifeStage === 'adult';

  return (
    <div className="surface p-6 border-none overflow-hidden border-b border-gray-200">
      <label htmlFor="weight" className="label text-lg font-bold text-gray-900 mb-4">
        {CALORIE_UI_TEXT.INPUT.WEIGHT_LABEL}
      </label>
      <div className="row flex flex-col gap-4">
        {/* 体重 */}
        <div>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="0.5"
            placeholder={CALORIE_UI_TEXT.INPUT.WEIGHT_PLACEHOLDER}
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="w-full h-14 px-6 border-2 border-pink-200 rounded-3xl text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
          />
        </div>

        {/* ライフステージ */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-1.5">
            {CALORIE_UI_TEXT.INPUT.LIFE_STAGE_LABEL}
          </h2>
          <SegmentedButton
            options={[
              { value: 'kitten', label: CALORIE_UI_TEXT.INPUT.STAGES.KITTEN },
              { value: 'adult', label: CALORIE_UI_TEXT.INPUT.STAGES.ADULT },
              { value: 'senior', label: CALORIE_UI_TEXT.INPUT.STAGES.SENIOR },
            ]}
            value={lifeStage}
            onChange={onLifeStageChange}
            ariaLabel="ライフステージ"
          />
        </div>

        {/* 去勢/避妊（成猫のみ表示） */}
        {showNeuteredToggle && (
          <div className="switch flex items-center gap-2.5">
            <input
              id="neutered"
              type="checkbox"
              checked={neutered}
              onChange={(e) => onNeuteredChange(e.target.checked)}
              aria-label="去勢・避妊済み"
              className="appearance-none w-11 h-6 rounded-full bg-gray-300 relative cursor-pointer outline-none border-none checked:bg-pink-600 transition-colors duration-150 ease-in-out
                before:content-[''] before:absolute before:left-0.5 before:top-0.5 before:w-5 before:h-5 before:rounded-full before:bg-white before:transition-transform before:duration-150 before:ease-in-out before:shadow-sm
                checked:before:translate-x-5"
            />
            <label htmlFor="neutered" className="text-sm text-gray-900">
              {CALORIE_UI_TEXT.INPUT.NEUTERED_LABEL}
            </label>
          </div>
        )}

        {/* 目標 */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-1.5">
            {CALORIE_UI_TEXT.INPUT.GOAL_LABEL}
          </h2>
          <SegmentedButton
            options={[
              { value: 'maintain', label: CALORIE_UI_TEXT.INPUT.GOALS.MAINTAIN },
              { value: 'loss', label: CALORIE_UI_TEXT.INPUT.GOALS.LOSS },
              { value: 'gain', label: CALORIE_UI_TEXT.INPUT.GOALS.GAIN },
            ]}
            value={goal}
            onChange={onGoalChange}
            ariaLabel="目標"
          />
        </div>
      </div>

      {error && (
        <div id="error" className="error text-red-700 text-xs mt-1.5 min-h-[1.2em]" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}
