import nock from 'nock';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {
  expect, test, beforeAll, afterAll,
} from '@jest/globals';
import pageLoader from '../pageLoader.js';

const tmpDir = path.join(os.tmpdir(), 'page-loader-tests');

beforeAll(async () => {
  await fs.mkdir(tmpDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test('downloads HTML page and saves to file', async () => {
  const url = 'https://example.com';
  const htmlContent = '<html><head></head><body>Hello, World!</body></html>';

  nock('https://example.com').get('/').reply(200, htmlContent);

  const filePath = await pageLoader(url, { output: tmpDir });
  const savedContent = await fs.readFile(filePath, 'utf-8');

  expect(savedContent).toBe(htmlContent);
});

test('throws an error for 404 response', async () => {
  nock('https://example.com').get('/not-found').reply(404);

  await expect(pageLoader('https://example.com/not-found', { output: tmpDir }))
    .rejects.toThrow('Failed to download page');
});
