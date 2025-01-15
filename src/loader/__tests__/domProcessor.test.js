import {
  describe,
  expect, test,
} from '@jest/globals';
import processHtml from '../domProcessor.js';

describe('processHtml', () => {
  const baseUrl = 'https://example.com';

  test('should return HTML unchanged and empty resources when there are no resource tags', () => {
    const html = '<div>Hello World</div>';
    const result = processHtml(html, baseUrl);

    expect(result.html).toBe('<html><head></head><body><div>Hello World</div></body></html>');
    expect(result.resources).toEqual([]);
  });

  test('should process local img, link, and script tags', () => {
    const html = `
      <img src="/images/logo.png" alt="logo">
      <link rel="stylesheet" href="/styles/main.css">
      <script src="/scripts/app.js"></script>
    `;
    const result = processHtml(html, baseUrl);

    expect(result.resources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tag: 'img',
          attr: 'src',
          originalPath: '/images/logo.png',
          absoluteUrl: `${baseUrl}/images/logo.png`,
          localPath: expect.stringMatching(/example-com_files\/.*logo\.png$/),
        }),
        expect.objectContaining({
          tag: 'link',
          attr: 'href',
          originalPath: '/styles/main.css',
          absoluteUrl: `${baseUrl}/styles/main.css`,
          localPath: expect.stringMatching(/example-com_files\/.*main\.css$/),
        }),
        expect.objectContaining({
          tag: 'script',
          attr: 'src',
          originalPath: '/scripts/app.js',
          absoluteUrl: `${baseUrl}/scripts/app.js`,
          localPath: expect.stringMatching(/example-com_files\/.*app\.js$/),
        }),
      ]),
    );

    expect(result.html).toContain('src="example-com_files/');
    expect(result.html).toContain('href="example-com_files/');
  });

  test('should skip external URLs', () => {
    const html = `
      <img src="https://cdn.example.org/logo.png" alt="external logo">
      <link rel="stylesheet" href="https://cdn.example.org/styles.css">
      <script src="https://cdn.example.org/app.js"></script>
    `;
    const result = processHtml(html, baseUrl);

    expect(result.resources).toEqual([]);
    expect(result.html).toContain('src="https://cdn.example.org/logo.png"');
    expect(result.html).toContain('href="https://cdn.example.org/styles.css"');
    expect(result.html).toContain('src="https://cdn.example.org/app.js"');
  });

  test('should handle missing attributes gracefully', () => {
    const html = `
      <img alt="no src">
      <link rel="stylesheet">
      <script></script>
    `;
    const result = processHtml(html, baseUrl);

    expect(result.resources).toEqual([]);
    expect(result.html).toContain('<img alt="no src">');
    expect(result.html).toContain('<link rel="stylesheet">');
    expect(result.html).toContain('<script></script>');
  });

  test('should skip tags without an extension', () => {
    const html = `
      <img src="/path/to/resource">
      <link href="/no-ext-path">
      <script src="/path/no-ext">
    `;
    const result = processHtml(html, baseUrl);

    expect(result.resources).toEqual([]);
    expect(result.html).toContain('src="/path/to/resource"');
    expect(result.html).toContain('href="/no-ext-path"');
    expect(result.html).toContain('src="/path/no-ext"');
  });
});
