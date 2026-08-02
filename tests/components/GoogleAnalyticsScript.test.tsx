import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import GoogleAnalyticsScript from '@/components/GoogleAnalyticsScript';
import { flushQueuedEvents, flushQueuedPageviews } from '@/lib/gtag';

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ children, id, onLoad }: { children?: ReactNode; id?: string; onLoad?: () => void }) => (
    <button id={id} onClick={onLoad}>
      {children}
    </button>
  ),
}));

jest.mock('@/lib/gtag', () => ({
  flushQueuedEvents: jest.fn(),
  flushQueuedPageviews: jest.fn(),
  GA_MEASUREMENT_ID: 'G-TEST123',
}));

describe('GoogleAnalyticsScript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables the initial automatic pageview in the first config command', () => {
    const { container } = render(<GoogleAnalyticsScript />);
    const initScript = container.querySelector('#ga4-init');

    expect(initScript).toHaveTextContent("window.gtag('config', 'G-TEST123');");
    expect(initScript).not.toHaveTextContent('send_page_view: false');
  });

  it('flushes queued pageviews before queued custom events', () => {
    const { container } = render(<GoogleAnalyticsScript />);
    const externalScript = container.querySelector('#ga4-script');

    expect(externalScript).not.toBeNull();
    fireEvent.click(externalScript!);

    expect(flushQueuedPageviews).toHaveBeenCalledTimes(1);
    expect(flushQueuedEvents).toHaveBeenCalledTimes(1);
    expect((flushQueuedPageviews as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      (flushQueuedEvents as jest.Mock).mock.invocationCallOrder[0],
    );
  });
});
