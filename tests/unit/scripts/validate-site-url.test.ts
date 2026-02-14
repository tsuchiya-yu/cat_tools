import * as validateSiteUrlModule from '../../../scripts/validate-site-url';

const { validateSiteUrlForProduction, isLocalHost } = validateSiteUrlModule;

describe('validate-site-url', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('本番以外はチェックをスキップする', () => {
    process.env.NODE_ENV = 'development';
    expect(() => validateSiteUrlForProduction('http://localhost:3000')).not.toThrow();
  });

  test('本番で空文字は失敗する', () => {
    process.env.NODE_ENV = 'production';
    expect(() => validateSiteUrlForProduction('')).toThrow(
      'SITE_URL is required for production build.'
    );
  });

  test('本番で不正URLは失敗する', () => {
    process.env.NODE_ENV = 'production';
    expect(() => validateSiteUrlForProduction('not a url')).toThrow(
      'SITE_URL must be a valid URL in production'
    );
  });

  test('本番でhttpは失敗する', () => {
    process.env.NODE_ENV = 'production';
    expect(() => validateSiteUrlForProduction('http://cat-tools.catnote.tokyo')).toThrow(
      'SITE_URL must start with https:// in production.'
    );
  });

  test('本番でlocalhostは失敗する', () => {
    process.env.NODE_ENV = 'production';
    expect(() => validateSiteUrlForProduction('https://localhost:3000')).toThrow(
      'SITE_URL host must not be local in production: "localhost"'
    );
  });

  test('本番でhttps公開URLは通過する', () => {
    process.env.NODE_ENV = 'production';
    expect(() => validateSiteUrlForProduction('https://cat-tools.catnote.tokyo')).not.toThrow();
  });

  test('isLocalHost はローカル系ホストを判定する', () => {
    expect(isLocalHost('localhost')).toBe(true);
    expect(isLocalHost('127.0.0.1')).toBe(true);
    expect(isLocalHost('0.0.0.0')).toBe(true);
    expect(isLocalHost('machine.local')).toBe(true);
    expect(isLocalHost('cat-tools.catnote.tokyo')).toBe(false);
  });
});
