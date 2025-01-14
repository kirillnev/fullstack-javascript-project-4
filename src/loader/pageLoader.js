import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const sanitizeFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const cleanedPathname = pathname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+$/, '');
  return `${hostname}${cleanedPathname}.html`;
};

const pageLoader = (url, options = {}) => {
  const outputDir = options.output || process.cwd();
  const fileName = sanitizeFileName(url);
  const filePath = path.resolve(outputDir, fileName);

  return axios.get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath)
    .catch((error) => {
      throw new Error(`Failed to download page: ${error.message}`);
    });
};

export default pageLoader;
