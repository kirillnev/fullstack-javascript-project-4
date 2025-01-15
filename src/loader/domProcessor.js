import * as cheerio from 'cheerio';
import path from 'path';
import { generateDirName, generateFileName } from './nameGenerator.js';

const processHtml = (html, pageUrl) => {
  const $ = cheerio.load(html);
  const { host, origin } = new URL(pageUrl);
  const localDirName = generateDirName(pageUrl);

  const resourceTags = [
    { tag: 'img', attr: 'src' },
    { tag: 'link', attr: 'href' },
    { tag: 'script', attr: 'src' },
  ];

  const resources = [];

  resourceTags.forEach(({ tag, attr }) => {
    $(tag).each((i, element) => {
      const originalPath = $(element).attr(attr);

      if (!originalPath) return;

      const resourceUrl = new URL(originalPath, origin);

      // Пропускаем локальные ссылки
      if (originalPath.startsWith(localDirName)) {
        return;
      }

      if (resourceUrl.host !== host) {
        return;
      }

      const localFileName = generateFileName(resourceUrl.toString());
      const localPath = path.join(localDirName, localFileName);

      const resource = {
        tag,
        attr,
        originalPath,
        absoluteUrl: resourceUrl.toString(),
        localPath,
      };

      // Обновляем HTML с локальной ссылкой
      $(resource.tag).attr(resource.attr, resource.localPath);

      resources.push(resource);
    });
  });

  return { html: $.html(), resources };
};

export default processHtml;
