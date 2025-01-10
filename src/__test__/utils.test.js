import { expect, test } from '@jest/globals';
import transformUrl from '../utils.js';

describe('Тестирование функции transformUrl', () => {
  test('URL состоит из домена >=2 уровня без протокола, поддомена и путей -> точки заменяются на дефис', () => {
    const input = 'example.com';
    const expected = 'example-com.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с протоколом (HTTP/HTTPS) -> протокол удаляется', () => {
    const input = 'https://example.com';
    const expected = 'example-com.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с путём -> путь преобразуется в дефисный формат', () => {
    const input = 'example.com/some/page';
    const expected = 'example-com-some-page.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с параметрами запроса -> параметры добавляются с дефисами', () => {
    const input = 'example.com/page?param=123&flag=true';
    const expected = 'example-com-page-param-123-flag-true.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с якорем -> якорь включается в имя файла', () => {
    const input = 'example.com/page#section';
    const expected = 'example-com-page-section.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с дефисами и подчеркиваниями -> они заменяются на дефис', () => {
    const input = 'example.com/some_page-123';
    const expected = 'example-com-some-page-123.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с числовыми значениями -> числа остаются неизменными', () => {
    const input = 'example.com/12345';
    const expected = 'example-com-12345.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('Длинный URL с комбинацией символов (включая пробелы, спецсимволы, параметры и якори) -> форматирование происходит корректно', () => {
    const input = 'https://sub.domain.com/long path/!@#$%^&*()_+=?param=123#anchor';
    const expected = 'sub-domain-com-long-path---------------param-123-anchor.html';
    expect(transformUrl(input)).toBe(expected);
  });

  test('URL с пробелами и спецсимволами -> пробелы и спецсимволы заменяются на дефисы', () => {
    const input = 'example.com/со слов?парам=привет';
    const expected = 'example-com---------------------.html';
    expect(transformUrl(input)).toBe(expected);
  });
});
