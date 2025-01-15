export const generatePageName = (url) => {
  const { hostname, pathname } = new URL(url);
  const path = `${hostname}${pathname}`;
  return `${path
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+$/, '')}.html`;
};

export const generateFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const path = `${hostname}${pathname}`;
  return path
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+$/, '');
};

export const generateDirName = (url) => {
  const { hostname, pathname } = new URL(url);
  const path = `${hostname}${pathname}`;
  return `${path
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+$/, '')}_files`;
};
