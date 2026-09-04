#!/usr/bin/env node

const { readFile } = require('node:fs/promises');
const { normalizeReviewResult, validateFindingsAgainstDiff } = require('./review-core');

function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) throw new Error(`missing argument: ${name}`);
  return process.argv[index + 1];
}

async function githubRequest(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = new Error(`GitHub API request failed with HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? undefined : response.json();
}

async function listAll(path, request = githubRequest) {
  const items = [];
  for (let page = 1; page <= 20; page += 1) {
    const separator = path.includes('?') ? '&' : '?';
    const batch = await request(`${path}${separator}per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('GitHub API returned a non-array list response');
    items.push(...batch);
    if (batch.length < 100) return items;
  }
  throw new Error('GitHub API pagination limit exceeded');
}

function markerFor(runId, headSha) {
  if (!/^\d+$/.test(runId) || !/^[0-9a-f]{40}$/.test(headSha)) {
    throw new Error('invalid run ID or head SHA');
  }
  return `<!-- cat-tools-openrouter-review:run=${runId}:sha=${headSha} -->`;
}

async function publishReview({ payload, repository, pullNumber, runId, request = githubRequest }) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || !Number.isInteger(pullNumber)) {
    throw new Error('invalid repository or pull request number');
  }

  if (payload.version !== 1 || !/^[0-9a-f]{40}$/.test(payload.headSha)) {
    throw new Error('invalid generated review envelope');
  }
  const review = normalizeReviewResult(payload.review);
  const marker = markerFor(runId, payload.headSha);
  const apiBase = `/repos/${repository}/pulls/${pullNumber}`;

  const existingReviews = await listAll(`${apiBase}/reviews`, request);
  if (existingReviews.some((item) => typeof item.body === 'string' && item.body.includes(marker))) {
    return { status: 'already_published' };
  }

  const changedFiles = await listAll(`${apiBase}/files`, request);
  const comments = validateFindingsAgainstDiff(review, changedFiles);
  const currentPull = await request(apiBase);
  if (currentPull.head?.sha !== payload.headSha) {
    return { status: 'stale' };
  }

  const body = review.status === 'clean'
    ? `${review.summary}\n\n指摘はありませんでした。\n\n${marker}`
    : `${review.summary}\n\n${marker}`;

  try {
    await request(`${apiBase}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        commit_id: payload.headSha,
        event: 'COMMENT',
        body,
        comments,
      }),
    });
  } catch (error) {
    if (error.status === 422) {
      throw new Error('GitHub rejected the validated review with HTTP 422; refusing to guess new locations');
    }
    throw error;
  }
  return { status: 'published', model: payload.model, headSha: payload.headSha };
}

async function main() {
  if (!process.env.GH_TOKEN) throw new Error('publish token is not configured');
  const resultFile = readArg('--result-file');
  const repository = readArg('--repository');
  const pullNumber = Number(readArg('--pull-number'));
  const runId = readArg('--run-id');
  const payload = JSON.parse(await readFile(resultFile, 'utf8'));
  const result = await publishReview({ payload, repository, pullNumber, runId });

  if (result.status === 'stale') {
    throw new Error('PR HEAD changed before publication; refusing to publish a stale review');
  }
  if (result.status === 'already_published') {
    console.log('Review already exists for this run and head SHA; publication is idempotently complete.');
    return;
  }
  console.log(`Published one review for ${result.model} at ${result.headSha}.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`OpenRouter review publication failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { githubRequest, listAll, markerFor, publishReview };
