import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import transformUrl from './utils.js';

const pageLoader = (link, outputDir) => {
  const fileName = transformUrl(link);
  const filePath = path.join(outputDir, fileName);

  return axios.get(link)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath);
};

export default pageLoader;
