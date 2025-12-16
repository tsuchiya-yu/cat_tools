// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const { readFile } = require('node:fs/promises');
const path = require('node:path');

const existingFetch =
  typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined;

function isDatasetRequest(url) {
  try {
    return new URL(url).pathname === '/data/cat_foods.json';
  } catch {
    return typeof url === 'string' && url.endsWith('/data/cat_foods.json');
  }
}

function createMockResponse(body) {
  return {
    ok: true,
    status: 200,
    headers: {
      get: (name) => {
        if (name.toLowerCase() === 'content-type') {
          return 'application/json';
        }
        return null;
      },
    },
    json: async () => JSON.parse(body),
    text: async () => body,
  };
}

async function handleDatasetRequest() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'cat_foods.json');
  const body = await readFile(filePath, 'utf-8');
  return createMockResponse(body);
}

globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input?.url;

  if (url && isDatasetRequest(url)) {
    return handleDatasetRequest();
  }

  if (existingFetch) {
    return existingFetch(input, init);
  }

  throw new Error('fetch is not implemented in this Jest environment');
};
