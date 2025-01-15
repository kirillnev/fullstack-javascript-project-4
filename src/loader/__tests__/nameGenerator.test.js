import {
  describe,
  expect, test,
} from '@jest/globals';
import {
  generatePageName,
  generateFileName,
  generateDirName,
} from '../nameGenerator.js';

describe('URL name generation utilities', () => {
  describe('generatePageName', () => {
    test('Должна генерировать имя файла html из URL без пути', () => {
      const url = 'https://example.com';
      const result = generatePageName(url);

      expect(result).toBe('example-com.html');
    });

    test('Должна генерировать имя файла html из URL с / на конце', () => {
      const url = 'https://example.com/';
      const result = generatePageName(url);

      expect(result).toBe('example-com.html');
    });

    test('Должна генерировать имя файла html из URL с путём', () => {
      const url = 'https://example.com/path/to/page';
      const result = generatePageName(url);

      expect(result).toBe('example-com-path-to-page.html');
    });

    test('Должна заменять все не-буквенно-цифровые символы на дефис', () => {
      const url = 'https://example.com/path$%^&/to(())=page';
      const result = generatePageName(url);

      expect(result).toBe('example-com-path-to-page.html');
    });

    test('Должна убирать подряд идущие дефисы в конце', () => {
      const url = 'https://example.com/path/';
      const result = generatePageName(url);

      expect(result).toBe('example-com-path.html');
    });

    test('Должна корректно обрабатывать query-параметры', () => {
      const url = 'https://example.com/path/to/page?query=123';
      const result = generatePageName(url);

      expect(result).toBe('example-com-path-to-page.html');
    });
  });

  describe('generateFileName', () => {
    test('Должна генерировать имя файла без расширения из URL без пути', () => {
      const url = 'https://example.com';
      const result = generateFileName(url);

      expect(result).toBe('example-com');
    });

    test('Должна генерировать имя файла без расширения из URL с / на конце', () => {
      const url = 'https://example.com/';
      const result = generateFileName(url);

      expect(result).toBe('example-com');
    });

    test('Должна заменять все не-буквенно-цифровые символы на дефис', () => {
      const url = 'https://example.com/my-file?param=1';
      const result = generateFileName(url);

      expect(result).toBe('example-com-my-file');
    });

    test('Должна корректно обрабатывать сложные пути', () => {
      const url = 'http://blog.example.co.uk/posts/new_post/';
      const result = generateFileName(url);

      expect(result).toBe('blog-example-co-uk-posts-new-post');
    });
  });

  describe('generateDirName', () => {
    test('Должна генерировать имя директории c суффиксом _files', () => {
      const url = 'https://example.com/path';
      const result = generateDirName(url);

      expect(result).toBe('example-com-path_files');
    });

    test('Должна обрабатывать конечный / и убирать лишние дефисы перед .files', () => {
      const url = 'https://example.com/path/';
      const result = generateDirName(url);

      expect(result).toBe('example-com-path_files');
    });

    test('Должна заменять символы, не являющиеся буквой или цифрой, на дефис', () => {
      const url = 'https://sub.example.io/#$^?test=1';
      const result = generateDirName(url);

      expect(result).toBe('sub-example-io_files');
    });

    test('Должна корректно работать на URL без пути', () => {
      const url = 'https://example.com';
      const result = generateDirName(url);

      expect(result).toBe('example-com_files');
    });
  });
});
