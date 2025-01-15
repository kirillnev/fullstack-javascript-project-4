import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { generatePageName } from './nameGenerator.js';

const pageLoader = (url, outputDir) => {
  const fileName = generatePageName(url);
  const filePath = path.resolve(outputDir, fileName);

  // console.log(`Saving page to: ${filePath}`);

  return fs.mkdir(outputDir, { recursive: true }) // Создаём директорию, если её нет
    .then(() => axios.get(url))
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Failed to download page: ${response.status}`);
      }
      // console.log(`Page content length: ${response.data.length} bytes`);
      return fs.writeFile(filePath, response.data);
    })
    .then(() => filePath)
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      throw new Error(`Failed to download page: ${error.message}`);
    });
};

export default pageLoader;
