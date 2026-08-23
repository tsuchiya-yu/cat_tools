'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import {
  CALCULATE_CAT_CALORIE_PATH,
  CALCULATE_CAT_FEEDING_PATH,
  CALCULATE_CAT_WATER_INTAKE_PATH,
} from '@/constants/paths';
import { MEAL_MANAGEMENT_UI_TEXT } from '@/constants/text';
import { event } from '@/lib/gtag';

type TargetTool = 'cat_calorie' | 'cat_feeding' | 'cat_water_intake';

interface PrimaryCardItem {
  targetTool: TargetTool;
  href: string;
  title: string;
  description: string;
  actionText: string;
}

const PRIMARY_CARDS: PrimaryCardItem[] = [
  {
    targetTool: 'cat_calorie',
    href: CALCULATE_CAT_CALORIE_PATH,
    title: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.CALORIE.TITLE,
    description: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.CALORIE.DESCRIPTION,
    actionText: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.CALORIE.ACTION,
  },
  {
    targetTool: 'cat_feeding',
    href: CALCULATE_CAT_FEEDING_PATH,
    title: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.FEEDING.TITLE,
    description: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.FEEDING.DESCRIPTION,
    actionText: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.FEEDING.ACTION,
  },
  {
    targetTool: 'cat_water_intake',
    href: CALCULATE_CAT_WATER_INTAKE_PATH,
    title: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.WATER_INTAKE.TITLE,
    description: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.WATER_INTAKE.DESCRIPTION,
    actionText: MEAL_MANAGEMENT_UI_TEXT.PRIMARY_CARDS.WATER_INTAKE.ACTION,
  },
];

export default function MealManagementCards() {
  const handleCardClick = useCallback((targetTool: TargetTool) => {
    event({
      action: 'related_tool_click',
      params: {
        source_tool: 'cat_meal_management',
        target_tool: targetTool,
        placement: 'meal_management_primary_card',
      },
    });
  }, []);

  return (
    <div className="grid gap-4 sm:gap-5">
      {PRIMARY_CARDS.map((card) => (
        <Link
          key={card.targetTool}
          href={card.href}
          onClick={() => handleCardClick(card.targetTool)}
          className="group block rounded-2xl border border-pink-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-pink-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
            {card.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {card.description}
          </p>
          <span className="mt-3 inline-flex items-center text-sm font-bold text-pink-600 group-hover:text-pink-700">
            {card.actionText}
          </span>
        </Link>
      ))}
    </div>
  );
}
