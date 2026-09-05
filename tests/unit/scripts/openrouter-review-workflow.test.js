const { readFileSync } = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '../../..');
const workflow = readFileSync(
  path.join(repositoryRoot, '.github/workflows/openrouter-pr-review.yml'),
  'utf8',
);

describe('OpenRouter review workflow security boundary', () => {
  test('runs trusted tooling separately from the pull request checkout', () => {
    expect(workflow).toContain('tooling_sha="${PR_BASE_SHA}"');
    expect(workflow).toContain('tooling_sha="$(jq -r \'.base.sha\' <<<"${pr_json}")"');
    expect(workflow).toContain('tooling_sha="${WORKFLOW_SHA}"');
    expect(workflow).toContain('ref: ${{ needs.authorize.outputs.tooling_sha }}');
    expect(workflow).not.toContain('ref: ${{ github.workflow_sha }}');
    expect(workflow).toContain('path: review-tools');
    expect(workflow).toContain('path: review-target');
    expect(workflow).toContain(
      'node "${GITHUB_WORKSPACE}/review-tools/scripts/openrouter-review/run-review.js"',
    );
    expect(workflow).not.toContain(
      'node "${GITHUB_WORKSPACE}/review-target/scripts/openrouter-review/',
    );
  });

  test('does not use the upstream action or upload review artifacts', () => {
    expect(workflow).not.toContain('JetBrains/junie-github-action');
    expect(workflow).not.toContain('actions/upload-artifact');
    expect(workflow).not.toContain('continue-on-error: true');
  });

  test('creates the write token only after generation', () => {
    const generateIndex = workflow.indexOf('- name: Generate and validate review');
    const tokenIndex = workflow.indexOf('- name: Create short-lived review publisher token');
    const publishIndex = workflow.indexOf('- name: Publish validated review');
    expect(generateIndex).toBeGreaterThan(-1);
    expect(tokenIndex).toBeGreaterThan(generateIndex);
    expect(publishIndex).toBeGreaterThan(tokenIndex);
    expect(workflow).toContain('permission-pull-requests: write');
    expect(workflow).toContain('pull-requests: read');
  });

  test('calls OpenRouter directly without installing or invoking Junie', () => {
    expect(workflow).not.toContain('Install Junie CLI');
    expect(workflow).not.toContain('JUNIE_VERSION');
    expect(workflow).not.toContain('junie ');
    expect(workflow).toContain('scripts/openrouter-review/run-review.js');
  });
});

describe('OpenRouter provider privacy constraints', () => {
  test('keeps the API key scoped to the generation step', () => {
    const generateIndex = workflow.indexOf('- name: Generate and validate review');
    const tokenIndex = workflow.indexOf('- name: Create short-lived review publisher token');
    const generationSection = workflow.slice(generateIndex, tokenIndex);
    expect(generationSection).toContain('OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}');
    expect(workflow.slice(tokenIndex)).not.toContain('OPENROUTER_API_KEY');
  });
});
