import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareMenu from '@/components/ShareMenu';

describe('ShareMenu analytics hooks', () => {
  const originalShare = navigator.share;
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    jest.restoreAllMocks();

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: originalShare,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
  });

  it('does not report share when the menu only opens', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));

    expect(onShareSuccess).not.toHaveBeenCalled();
  });

  it('reports native share only after navigator.share succeeds', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));
    await user.click(screen.getByRole('menuitem', { name: '共有する' }));

    expect(onShareSuccess).toHaveBeenCalledTimes(1);
    expect(onShareSuccess).toHaveBeenCalledWith('native');
  });

  it('does not report native share when navigator.share is cancelled or fails', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: jest.fn().mockRejectedValue(new Error('cancelled')),
    });

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));
    await user.click(screen.getByRole('menuitem', { name: '共有する' }));

    expect(onShareSuccess).not.toHaveBeenCalled();
  });

  it('reports copy link only after clipboard write succeeds', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));
    await user.click(screen.getByRole('menuitem', { name: 'リンクをコピー' }));

    expect(onShareSuccess).toHaveBeenCalledTimes(1);
    expect(onShareSuccess).toHaveBeenCalledWith('copy_link');
  });

  it('does not report copy link when clipboard write fails', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jest.fn().mockRejectedValue(new Error('copy failed')),
      },
    });

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));
    await user.click(screen.getByRole('menuitem', { name: 'リンクをコピー' }));

    expect(onShareSuccess).not.toHaveBeenCalled();
  });

  it('reports X share on click as share intent', async () => {
    const user = userEvent.setup();
    const onShareSuccess = jest.fn();

    render(
      <ShareMenu
        shareText="share text"
        shareUrl="https://example.com"
        onShareSuccess={onShareSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: '共有メニューを開く' }));
    await user.click(screen.getByRole('menuitem', { name: 'Xでシェア' }));

    expect(onShareSuccess).toHaveBeenCalledTimes(1);
    expect(onShareSuccess).toHaveBeenCalledWith('x');
  });
});
