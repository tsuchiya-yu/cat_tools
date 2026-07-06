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

  it('sends the pathname once on initial render', () => {
    render(<Analytics />);

    expect(pageview).toHaveBeenCalledWith('/cat-age');
    expect(pageview).toHaveBeenCalledTimes(1);
  });

  it('sends only the pathname when the initial URL has a query string', () => {
    window.history.replaceState({}, '', '/cat-age?foo=1&bar=2');

    render(<Analytics />);

    expect(pageview).toHaveBeenCalledWith('/cat-age');
    expect(pageview).toHaveBeenCalledTimes(1);
  });

  it('does not send another pageview when only the query string changes', () => {
    const { rerender } = render(<Analytics />);

    window.history.pushState({}, '', '/cat-age?foo=1');
    rerender(<Analytics />);

    expect(pageview).toHaveBeenCalledTimes(1);
  });

  it('sends one pageview when the pathname changes', () => {
    const { rerender } = render(<Analytics />);

    usePathname.mockReturnValue('/calculate-cat-calorie');
    rerender(<Analytics />);

    expect(pageview).toHaveBeenNthCalledWith(1, '/cat-age');
    expect(pageview).toHaveBeenNthCalledWith(2, '/calculate-cat-calorie');
    expect(pageview).toHaveBeenCalledTimes(2);
  });

  it('does not send a pageview when GA is disabled', () => {
    (isGAEnabled as jest.Mock).mockReturnValue(false);

    render(<Analytics />);

    expect(pageview).not.toHaveBeenCalled();
  });
});
