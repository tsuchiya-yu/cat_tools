import base from './playwright.config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  ...base,
  // Do not start a web server in this sandboxed environment.
  // Assumes an app server is already running at the configured baseURL.
  // @ts-expect-error override to undefined intentionally
  webServer: undefined,
  // Keep default reporters; CLI can override as needed.
});
