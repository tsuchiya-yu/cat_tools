// eslint-disable-next-line @typescript-eslint/no-require-imports
const { mkdirSync, rmSync, writeFileSync } = require('node:fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { join } = require('node:path');

const DEPLOYMENT_MARKER_FILENAME = 'deployment-sha.txt';

/**
 * @param {{ sha?: string, publicDir?: string }} options
 * @returns {{ markerPath: string, written: boolean }}
 */
function generateDeploymentMarker({
  sha = process.env.VERCEL_GIT_COMMIT_SHA,
  publicDir = join(__dirname, '..', 'public'),
} = {}) {
  const markerPath = join(publicDir, DEPLOYMENT_MARKER_FILENAME);
  const normalizedSha = sha?.trim();

  if (!normalizedSha) {
    rmSync(markerPath, { force: true });
    return { markerPath, written: false };
  }

  if (!/^[0-9a-f]{40}$/iu.test(normalizedSha)) {
    throw new Error('VERCEL_GIT_COMMIT_SHA must be a full 40-character Git SHA.');
  }

  mkdirSync(publicDir, { recursive: true });
  writeFileSync(markerPath, `${normalizedSha}\n`, 'utf8');
  return { markerPath, written: true };
}

if (require.main === module) {
  const result = generateDeploymentMarker();
  console.log(
    result.written
      ? `Generated ${result.markerPath}.`
      : 'Skipped deployment marker generation because VERCEL_GIT_COMMIT_SHA is not set.'
  );
}

module.exports = {
  DEPLOYMENT_MARKER_FILENAME,
  generateDeploymentMarker,
};
