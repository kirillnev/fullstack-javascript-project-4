import path from 'path';

export const generatePageName = (url) => {
  const { hostname, pathname } = new URL(url);
  const pagePath = `${hostname}${pathname}`;
  return `${pagePath
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}.html`;
};

export const generateFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const extension = path.extname(pathname) || '';
  const basePath = `${hostname}${path.dirname(pathname)}/${path.basename(pathname, extension)}`;

  return basePath
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + extension;
};

export const generateDirName = (url) => {
  const { hostname, pathname } = new URL(url);
  const dirPath = `${hostname}${pathname}`;
  return `${dirPath
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}_files`;
};
