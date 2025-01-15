import {
  describe,
  expect, test,
} from '@jest/globals';
import {
  generateFileName,
} from '../nameGenerator.js';

describe('generateFileName', () => {
  test('should generate a valid file name with domain and extension', () => {
    const url = 'https://example.com/assets/styles.css';
    const expected = 'example-com-assets-styles.css';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs without extension', () => {
    const url = 'https://example.com/scripts/main';
    const expected = 'example-com-scripts-main';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs with subdomains', () => {
    const url = 'https://cdn.example.com/images/photo.jpg';
    const expected = 'cdn-example-com-images-photo.jpg';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs with special characters', () => {
    const url = 'https://example.com/assets/image(1).jpg';
    const expected = 'example-com-assets-image-1.jpg';
    expect(generateFileName(url)).toBe(expected);
  });

  test('should handle URLs with query parameters', () => {
    const url = 'https://example.com/path/to/resource?param=value';
    const expected = 'example-com-path-to-resource';
    expect(generateFileName(url)).toBe(expected);
  });
});
