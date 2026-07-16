import { act, fireEvent, render, screen } from '@testing-library/react';
import CatCalorieCalculator from '@/app/calculate-cat-calorie/CatCalorieCalculator';
import { event } from '@/lib/gtag';

jest.mock('@/lib/gtag', () => ({
  event: jest.fn(),
}));

describe('CatCalorieCalculator analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    window.history.replaceState({}, '', '/calculate-cat-calorie');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces continuous input and sends calculation_complete once', () => {
    const { rerender } = render(<CatCalorieCalculator />);

    fireEvent.change(screen.getByLabelText('体重(kg)'), {
      target: { value: '4' },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.change(screen.getByLabelText('体重(kg)'), {
      target: { value: '4.' },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.change(screen.getByLabelText('体重(kg)'), {
      target: { value: '4.2' },
    });

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(event).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(event).toHaveBeenCalledWith({
      action: 'calculation_complete',
      params: {
        tool_id: 'cat_calorie',
      },
    });
    expect(event).toHaveBeenCalledTimes(1);

    rerender(<CatCalorieCalculator />);

    expect(event).toHaveBeenCalledTimes(1);
  });

  it('does not send calculation_complete when input is invalid', () => {
    render(<CatCalorieCalculator />);

    fireEvent.change(screen.getByLabelText('体重(kg)'), {
      target: { value: '0.1' },
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(event).not.toHaveBeenCalled();
  });

  it('sends related_tool_click for in-page related tool links', () => {
    render(<CatCalorieCalculator />);

    fireEvent.click(screen.getByRole('link', { name: '猫の給餌量計算ページ' }));

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      action: 'related_tool_click',
      params: {
        source_tool: 'cat_calorie',
        target_tool: 'cat_feeding',
        placement: 'feeding_steps_feeding_link',
      },
    });
  });
});
