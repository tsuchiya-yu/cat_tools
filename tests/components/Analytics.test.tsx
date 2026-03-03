import { render } from '@testing-library/react';
import Analytics from '@/components/Analytics';
import { pageview, isGAEnabled } from '@/lib/gtag';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/gtag', () => ({
  pageview: jest.fn(),
  isGAEnabled: jest.fn(),
}));

const { usePathname, useSearchParams } = jest.requireMock('next/navigation') as {
  usePathname: jest.Mock;
  useSearchParams: jest.Mock;
};

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isGAEnabled as jest.Mock).mockReturnValue(true);
    usePathname.mockReturnValue('/cat-age');
  });

  it('sends pathname only when query is empty', () => {
    useSearchParams.mockReturnValue({
      toString: () => '',
    });

    render(<Analytics />);

    expect(pageview).toHaveBeenCalledWith('/cat-age');
  });

  it('includes ? when query string exists', () => {
    useSearchParams.mockReturnValue({
      toString: () => 'foo=1&bar=2',
    });

    render(<Analytics />);

    expect(pageview).toHaveBeenCalledWith('/cat-age?foo=1&bar=2');
  });
});
