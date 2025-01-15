import {
  test, beforeAll, afterAll, describe, afterEach, expect, beforeEach, jest,
} from '@jest/globals';
import nock from 'nock';
import { promises as fs } from 'fs';
import path from 'path';
import loadResources from '../resourceLoader.js';

describe('loadResources', () => {
  const baseUrl = 'https://example.com';
  const outputDir = '/tmp/resources';
  const resources = [
    {
      absoluteUrl: `${baseUrl}/images/logo.png`,
      localPath: 'images/logo.png',
    },
    {
      absoluteUrl: `${baseUrl}/styles/main.css`,
      localPath: 'styles/main.css',
    },
  ];

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
    jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  test('should download and save all resources successfully', async () => {
    nock(baseUrl).get('/images/logo.png').reply(200, Buffer.from('image data'));
    nock(baseUrl).get('/styles/main.css').reply(200, Buffer.from('css data'));

    await loadResources(resources, outputDir);

    resources.forEach((res) => {
      const filePath = path.resolve(outputDir, res.localPath);
      expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(filePath), { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, expect.any(Buffer));
    });
  });

  test('should handle no resources gracefully', async () => {
    await expect(loadResources([], outputDir)).resolves.toBeUndefined();
    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
