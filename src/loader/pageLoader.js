import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { generatePageName } from './nameGenerator.js';

const pageLoader = (url, options = {}) => {
  const outputDir = options.output || process.cwd();
  const fileName = generatePageName(url);
  const filePath = path.resolve(outputDir, fileName);

  return axios.get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath)
    .catch((error) => {
      throw new Error(`Failed to download page: ${error.message}`);
    });
};

export default pageLoader;
