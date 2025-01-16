import {
  test, beforeAll, afterAll, describe, afterEach, expect, beforeEach, jest,
} from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import pageLoader from '../pageLoader.js';

describe('pageLoader', () => {
  const baseUrl = 'https://example.com';
  const outputDir = '/tmp';
  const pageContent = '<html><body>Hello World</body></html>';
  const pageName = 'example-com.html';
  const filePath = path.resolve(outputDir, pageName);

  let consoleErrorMock;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  test('should download and save the page successfully', async () => {
    nock(baseUrl).get('/').reply(200, pageContent);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(filePath, '');

    const result = await pageLoader(`${baseUrl}/`, outputDir);
    const savedContent = await fs.readFile(result, 'utf-8');

    expect(savedContent).toBe(pageContent);
    expect(result).toBe(filePath);
  });

  test('should throw an error if the response status is not 200', async () => {
    nock(baseUrl).get('/').reply(404);

    await expect(pageLoader(`${baseUrl}/`, outputDir)).rejects.toThrow('404');
    expect(console.error).toHaveBeenCalledWith('Error: Request failed with status code 404');
  });

  test('should throw an error if request fails due to network issue', async () => {
    nock(baseUrl).get('/').replyWithError('Network Error');

    await expect(pageLoader(`${baseUrl}/`, outputDir)).rejects.toThrow('Failed to download page: Network Error');
    expect(console.error).toHaveBeenCalledWith('Error: Network Error');
  });

  test('should throw an error if fs.writeFile fails', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementationOnce(() => {
      throw new Error('File System Error');
    });
    nock(baseUrl).get('/').reply(200, pageContent);

    await expect(pageLoader(`${baseUrl}/`, outputDir)).rejects.toThrow('Failed to download page: File System Error');
    expect(console.error).toHaveBeenCalledWith('Error: File System Error');
  });
});
