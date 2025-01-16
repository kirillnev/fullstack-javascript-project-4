import * as cheerio from 'cheerio';
import path from 'path';
import { generateDirName, generateFileName } from './nameGenerator.js';
import fs from 'fs/promises';
import nock from 'nock';

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

      let resourceUrl;
      try {
        resourceUrl = new URL(originalPath, origin);
      } catch (error) {
        console.error(`Invalid URL: ${originalPath}`);
        return;
      }

      if (resourceUrl.host !== host) {
        return;
      }

      const localFileName = generateFileName(resourceUrl.toString());
      const localPath = `${localDirName}/${localFileName}`;

      const resource = {
        tag,
        attr,
        originalPath,
        absoluteUrl: resourceUrl.toString(),
        localPath,
      };
      $(element).attr(attr, localPath);
      resources.push(resource);
    });
  });

  return { html: $.html(), resources };
};

export default processHtml;

