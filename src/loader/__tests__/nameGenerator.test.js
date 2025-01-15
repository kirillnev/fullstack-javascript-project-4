import {
  describe,
  expect, test,
} from '@jest/globals';
import {
  generatePageName,
  generateFileName,
  generateDirName,
} from '../nameGenerator.js';

describe('generatePageName', () => {
  test('should generate a valid page name from a URL', () => {
    const url = 'https://example.com/about';
    const expected = 'example-com-about.html';
    expect(generatePageName(url)).toBe(expected);
  });

  test('should handle URLs with query parameters', () => {
    const url = 'https://example.com/search?q=test';
    const expected = 'example-com-search.html';
    expect(generatePageName(url)).toBe(expected);
  });

  test('should handle URLs with trailing slashes', () => {
    const url = 'https://example.com/';
    const expected = 'example-com.html';
    expect(generatePageName(url)).toBe(expected);
  });
});

describe('generateFileName', () => {
  test('should generate a valid file name with extension', () => {
    const url = 'https://example.com/assets/styles.css';
    const expected = 'assets-styles.css';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs with no extension', () => {
    const url = 'https://example.com/scripts/main';
    const expected = 'scripts-main';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs with special characters', () => {
    const url = 'https://example.com/assets/image(1).jpg';
    const expected = 'assets-image-1.jpg';
    expect(generateFileName(url)).toBe(expected);
  });
});

describe('generateDirName', () => {
  test('should generate a valid directory name from a URL', () => {
    const url = 'https://example.com/blog';
    const expected = 'example-com-blog_files';
    expect(generateDirName(url)).toBe(expected);
  });

  test('should handle URLs with subdirectories', () => {
    const url = 'https://example.com/docs/api/v1';
    const expected = 'example-com-docs-api-v1_files';
    expect(generateDirName(url)).toBe(expected);
  });

  test('should handle URLs with special characters in the path', () => {
    const url = 'https://example.com/photos/2023-12-01/gallery#main';
    const expected = 'example-com-photos-2023-12-01-gallery_files';
    expect(generateDirName(url)).toBe(expected);
  });
});
