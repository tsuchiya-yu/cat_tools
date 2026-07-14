describe('gtag utilities', () => {
  const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const originalGtag = window.gtag;

  beforeEach(() => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
    delete window.gtag;
  });

  afterEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv;

    if (originalGtag) {
      window.gtag = originalGtag;
    } else {
      delete window.gtag;
    }
  });

  it('queues pageview until gtag is available and flushes later', async () => {
    const { pageview, flushQueuedPageviews, GA_MEASUREMENT_ID } = await import('@/lib/gtag');

    pageview('/cat-age');

    const gtagMock = jest.fn();
    window.gtag = gtagMock;

    flushQueuedPageviews();

    expect(gtagMock).toHaveBeenCalledTimes(1);
    expect(gtagMock).toHaveBeenCalledWith('config', GA_MEASUREMENT_ID, {
      page_path: '/cat-age',
    });
  });

  it('does not crash when event is sent before gtag is available', async () => {
    const { event } = await import('@/lib/gtag');

    expect(() =>
      event({
        action: 'click_button',
        category: 'ui',
      }),
    ).not.toThrow();
  });

  it('queues event until gtag is available and flushes later', async () => {
    const { event, flushQueuedEvents } = await import('@/lib/gtag');

    event({
      action: 'click_button',
      category: 'ui',
      label: 'signup',
      value: 1,
    });

    const gtagMock = jest.fn();
    window.gtag = gtagMock;

    flushQueuedEvents();

    expect(gtagMock).toHaveBeenCalledTimes(1);
    expect(gtagMock).toHaveBeenCalledWith('event', 'click_button', {
      event_category: 'ui',
      event_label: 'signup',
      value: 1,
    });
  });

  it('sends GA4 custom event parameters', async () => {
    const { event, GA_MEASUREMENT_ID } = await import('@/lib/gtag');
    const gtagMock = jest.fn();
    window.gtag = gtagMock;

    event({
      action: 'calculation_complete',
      params: {
        tool_id: 'cat_calorie',
        method: 'copy_link',
      },
    });

    expect(gtagMock).toHaveBeenCalledTimes(1);
    expect(gtagMock).toHaveBeenCalledWith('event', 'calculation_complete', {
      tool_id: 'cat_calorie',
      method: 'copy_link',
      event_category: undefined,
      event_label: undefined,
      value: undefined,
    });
    expect(GA_MEASUREMENT_ID).toBe('G-TEST123');
  });
});
