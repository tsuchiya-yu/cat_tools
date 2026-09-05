import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatFeedingCalculator from '@/components/CatFeedingCalculator';

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock('next/link', () => {
  function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('CatFeedingCalculator multi-food', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    window.history.replaceState({}, '', '/calculate-cat-feeding');
  });

  it('初期状態は1フードで、追加後に配分入力と結果計算ができる', async () => {
    const user = userEvent.setup();
    render(<CatFeedingCalculator />);

    expect(screen.getByLabelText('フードのカロリー（kcal/100g）')).toBeInTheDocument();
    expect(screen.queryByLabelText('フード名')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('1日の必要カロリー（kcal）'), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText('フードのカロリー（kcal/100g）'), {
      target: { value: '400' },
    });
    await user.click(screen.getByRole('button', { name: '＋ フードを追加' }));

    expect(screen.getByTestId('food-group-1')).toBeInTheDocument();
    expect(screen.getByTestId('food-group-2')).toBeInTheDocument();
    expect(screen.getAllByLabelText('カロリー（kcal / 100g）')[0]).toHaveValue('400');
    expect(screen.queryByTestId('multi-food-result')).not.toBeInTheDocument();

    const ratioInputs = screen.getAllByLabelText('与える分量（g）');
    fireEvent.change(ratioInputs[0], { target: { value: '40' } });
    fireEvent.change(ratioInputs[1], { target: { value: '20' } });
    expect(screen.queryByTestId('multi-food-result')).not.toBeInTheDocument();

    const densityInputs = screen.getAllByLabelText('カロリー（kcal / 100g）');
    fireEvent.change(densityInputs[1], { target: { value: '360' } });

    const result = screen.getByTestId('multi-food-result');
    expect(within(result).getByText('51.7')).toBeInTheDocument();
    expect(within(result).getByText('合計カロリー: 約200kcal')).toBeInTheDocument();
    expect(within(screen.getByTestId('food-result-1')).getByText('フード1')).toBeInTheDocument();
    expect(within(screen.getByTestId('food-result-1')).getByText('1日: 約34.5g')).toBeInTheDocument();
    expect(within(screen.getByTestId('food-result-2')).getByText('フード2')).toBeInTheDocument();
  });

  it('最大5件まで追加でき、削除で単一UIへ戻る', async () => {
    const user = userEvent.setup();
    render(<CatFeedingCalculator />);

    const addButton = screen.getByRole('button', { name: '＋ フードを追加' });
    for (let i = 0; i < 4; i += 1) {
      await user.click(addButton);
    }

    expect(screen.getByTestId('food-group-5')).toBeInTheDocument();
    expect(addButton).toBeDisabled();
    expect(screen.getByText('最大5種類まで追加できます')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'フード5を削除' }));
    await user.click(screen.getByRole('button', { name: 'フード4を削除' }));
    await user.click(screen.getByRole('button', { name: 'フード3を削除' }));
    await user.click(screen.getByRole('button', { name: 'フード2を削除' }));

    expect(screen.queryByTestId('food-group-2')).not.toBeInTheDocument();
    expect(screen.getByLabelText('フードのカロリー（kcal/100g）')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '＋ フードを追加' })).toBeEnabled();
  });

  it('既存の単一計算結果を維持する', () => {
    render(<CatFeedingCalculator />);

    fireEvent.change(screen.getByLabelText('1日の必要カロリー（kcal）'), {
      target: { value: '230' },
    });
    fireEvent.change(screen.getByLabelText('フードのカロリー（kcal/100g）'), {
      target: { value: '390' },
    });

    expect(screen.getByText('59')).toBeInTheDocument();
    expect(screen.getByText('朝 30 g / 夜 29 g')).toBeInTheDocument();
  });

  it('数値以外の入力でエラーメッセージを表示する', () => {
    render(<CatFeedingCalculator />);

    fireEvent.change(screen.getByLabelText('フードのカロリー（kcal/100g）'), {
      target: { value: 'あああ' },
    });

    expect(screen.getByText('数値を入力してください。')).toBeInTheDocument();
  });
});
