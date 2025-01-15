import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {
  test, beforeAll, afterAll,
} from '@jest/globals';

const tmpDir = path.join(os.tmpdir(), 'page-loader-tests');

beforeAll(async () => {
  await fs.mkdir(tmpDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('throws an error for 404 response', async () => {});
