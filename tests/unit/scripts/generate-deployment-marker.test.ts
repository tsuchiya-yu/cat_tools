import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as markerModule from '../../../scripts/generate-deployment-marker';

const { DEPLOYMENT_MARKER_FILENAME, generateDeploymentMarker } = markerModule;

describe('generate-deployment-marker', () => {
  let publicDir: string;

  beforeEach(() => {
    publicDir = mkdtempSync(join(tmpdir(), 'cat-tools-marker-'));
  });

  afterEach(() => {
    rmSync(publicDir, { recursive: true, force: true });
  });

  test('Vercelのfull commit SHAを公開markerへ書き込む', () => {
    const sha = 'a'.repeat(40);

    expect(generateDeploymentMarker({ sha, publicDir })).toEqual({
      markerPath: join(publicDir, DEPLOYMENT_MARKER_FILENAME),
      written: true,
    });
    expect(
      readFileSync(join(publicDir, DEPLOYMENT_MARKER_FILENAME), 'utf8')
    ).toBe(`${sha}\n`);
  });

  test('SHA未設定時は古いmarkerを残さない', () => {
    const markerPath = join(publicDir, DEPLOYMENT_MARKER_FILENAME);
    writeFileSync(markerPath, `${'b'.repeat(40)}\n`, 'utf8');

    expect(generateDeploymentMarker({ sha: '', publicDir }).written).toBe(false);
    expect(existsSync(markerPath)).toBe(false);
  });
});
