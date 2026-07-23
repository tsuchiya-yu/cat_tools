import { render } from '@testing-library/react';
import Analytics from '@/components/Analytics';
import { pageview, isGAEnabled } from '@/lib/gtag';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/lib/gtag', () => ({
  pageview: jest.fn(),
  isGAEnabled: jest.fn(),
}));

const { usePathname } = jest.requireMock('next/navigation') as {
  usePathname: jest.Mock;
};

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isGAEnabled as jest.Mock).mockReturnValue(true);
    usePathname.mockReturnValue('/cat-age');
    window.history.replaceState({}, '', '/cat-age');
  });

  it('does not send a pageview on initial render', () => {
    render(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });

  it('does not send a pageview when the initial URL has a query string', () => {
    window.history.replaceState({}, '', '/cat-age?foo=1&bar=2');

    render(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });

  it('does not send another pageview when only the query string changes', () => {
    const { rerender } = render(<Analytics />);

    window.history.pushState({}, '', '/cat-age?foo=1');
    rerender(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });

  it('sends one pageview when the pathname changes', () => {
    const { rerender } = render(<Analytics />);

    usePathname.mockReturnValue('/calculate-cat-calorie');
    rerender(<Analytics />);

    expect(pageview).toHaveBeenCalledWith('/calculate-cat-calorie');
    expect(pageview).toHaveBeenCalledTimes(1);
  });

  it('does not send a pageview on pathname changes when GA is disabled', () => {
    (isGAEnabled as jest.Mock).mockReturnValue(false);

    const { rerender } = render(<Analytics />);

    usePathname.mockReturnValue('/calculate-cat-calorie');
    rerender(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });

  it('does not send a pageview when pathname is null', () => {
    usePathname.mockReturnValue(null);

    render(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });

  it('does not send a pageview when the initial null pathname resolves', () => {
    usePathname.mockReturnValue(null);
    const { rerender } = render(<Analytics />);

    usePathname.mockReturnValue('/cat-age');
    rerender(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });
});
