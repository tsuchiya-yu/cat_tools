import { fireEvent, render, screen } from '@testing-library/react';
import MealManagementCards from '@/app/cat-meal-management/MealManagementCards';
import { event } from '@/lib/gtag';

jest.mock('@/lib/gtag', () => ({
  event: jest.fn(),
}));

describe('MealManagementCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 3 primary cards with correct destinations', () => {
    render(<MealManagementCards />);

    const calorieLink = screen.getByRole('link', {
      name: /1日に必要なカロリーを知りたい/,
    });
    const feedingLink = screen.getByRole('link', {
      name: /フードを何g与えればよいか知りたい/,
    });
    const waterLink = screen.getByRole('link', {
      name: /必要水分量の目安を知りたい/,
    });

    expect(calorieLink).toHaveAttribute('href', '/calculate-cat-calorie');
    expect(feedingLink).toHaveAttribute('href', '/calculate-cat-feeding');
    expect(waterLink).toHaveAttribute('href', '/calculate-cat-water-intake');
  });

  it('emits related_tool_click analytics event exactly once with exact params on click', () => {
    render(<MealManagementCards />);

    const calorieLink = screen.getByRole('link', {
      name: /1日に必要なカロリーを知りたい/,
    });
    fireEvent.click(calorieLink);

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      action: 'related_tool_click',
      params: {
        source_tool: 'cat_meal_management',
        target_tool: 'cat_calorie',
        placement: 'meal_management_primary_card',
      },
    });

    const feedingLink = screen.getByRole('link', {
      name: /フードを何g与えればよいか知りたい/,
    });
    fireEvent.click(feedingLink);

    expect(event).toHaveBeenCalledTimes(2);
    expect(event).toHaveBeenLastCalledWith({
      action: 'related_tool_click',
      params: {
        source_tool: 'cat_meal_management',
        target_tool: 'cat_feeding',
        placement: 'meal_management_primary_card',
      },
    });

    const waterLink = screen.getByRole('link', {
      name: /必要水分量の目安を知りたい/,
    });
    fireEvent.click(waterLink);

    expect(event).toHaveBeenCalledTimes(3);
    expect(event).toHaveBeenLastCalledWith({
      action: 'related_tool_click',
      params: {
        source_tool: 'cat_meal_management',
        target_tool: 'cat_water_intake',
        placement: 'meal_management_primary_card',
      },
    });
  });
});
