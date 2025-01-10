import {
  afterAll, afterEach, beforeAll, beforeEach, expect, test,
} from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';

let tempDir;

beforeAll(() => {
  nock.disableNetConnect(); // чтобы запросы "наружу" блокировались
});

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-')); // временная директория
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true }); // очищаем после тестов
});

afterAll(() => {
  nock.enableNetConnect();
});

test('should download page and save in the specified directory', async () => {
  const host = 'https://ru.hexlet.io';
  const route = '/courses';
  const url = `${host}${route}`;
  const expectedContent = '<html><body><h1>Hexlet</h1></body></html>';

  nock(host)
    .get(route)
    .reply(200, expectedContent); // мок ответа сервера

  const filePath = await pageLoader(url, tempDir);

  // Проверка, что файл создан
  const savedContent = await fs.readFile(filePath, 'utf-8');
  expect(savedContent).toBe(expectedContent);
});

test('should throw an error for non-existing URL (404)', async () => {
  const host = 'https://ru.hexlet.io';
  const route = '/non-existent';
  const url = `${host}${route}`;

  nock(host).get(route).reply(404);

  await expect(pageLoader(url, tempDir)).rejects.toThrow('Request failed with status code 404');
});

test('should throw an error when network is unavailable', async () => {
  const url = 'https://example.com';

  nock('https://example.com').get('/').replyWithError('Network error');

  await expect(pageLoader(url, tempDir)).rejects.toThrow('Network error');
});

test('should throw an error for invalid URL', async () => {
  const invalidUrl = 'not-a-url';

  await expect(pageLoader(invalidUrl, tempDir)).rejects.toThrow(/invalid url/i);
});
