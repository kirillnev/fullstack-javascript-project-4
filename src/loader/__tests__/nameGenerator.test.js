import {
  describe,
  expect, test,
} from '@jest/globals';

import { generatePageName, generateFileName, generateDirName } from '../nameGenerator.js';

describe('nameGenerator functions', () => {
  describe('generatePageName', () => {
    test('should generate a valid HTML page name from URL', () => {
      const url = 'https://example.com/path/to/page';
      const result = generatePageName(url);
      expect(result).toBe('example-com-path-to-page.html');
    });

    test('should handle URL with trailing slash', () => {
      const url = 'https://example.com/path/to/';
      const result = generatePageName(url);
      expect(result).toBe('example-com-path-to.html');
    });

    test('should handle URL without path', () => {
      const url = 'https://example.com';
      const result = generatePageName(url);
      expect(result).toBe('example-com.html');
    });

    test('should handle URL with special characters', () => {
      const url = 'https://example.com/path/to/page?query=123&name=abc';
      const result = generatePageName(url);
      expect(result).toBe('example-com-path-to-page.html');
    });
  });

  describe('generateFileName', () => {
    test('should generate a valid file name from URL with extension', () => {
      const url = 'https://example.com/path/to/image.png';
      const result = generateFileName(url);
      expect(result).toBe('example-com-path-to-image.png');
    });

    test('should handle URL without extension', () => {
      const url = 'https://example.com/path/to/resource';
      const result = generateFileName(url);
      expect(result).toBe('example-com-path-to-resource');
    });

    test('should handle URL with complex path and special characters', () => {
      const url = 'https://sub.example.com/path/to/some.file?param=value';
      const result = generateFileName(url);
      expect(result).toBe('sub-example-com-path-to-some.file');
    });

    test('should handle root-level file', () => {
      const url = 'https://example.com/image.jpg';
      const result = generateFileName(url);
      expect(result).toBe('example-com-image.jpg');
    });
  });

  describe('generateDirName', () => {
    test('should generate a valid directory name from URL', () => {
      const url = 'https://example.com/path/to/page';
      const result = generateDirName(url);
      expect(result).toBe('example-com-path-to-page_files');
    });

    test('should handle URL with trailing slash', () => {
      const url = 'https://example.com/path/to/';
      const result = generateDirName(url);
      expect(result).toBe('example-com-path-to_files');
    });

    test('should handle URL without path', () => {
      const url = 'https://example.com';
      const result = generateDirName(url);
      expect(result).toBe('example-com_files');
    });

    test('should handle URL with query parameters', () => {
      const url = 'https://example.com/page?param=value';
      const result = generateDirName(url);
      expect(result).toBe('example-com-page_files');
    });
  });
});
