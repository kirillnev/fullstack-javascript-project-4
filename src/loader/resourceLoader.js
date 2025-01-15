import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import Listr from 'listr';

const loadResources = (resources, outputDir) => {
  if (resources.length === 0) {
    return Promise.resolve(); // Нет ресурсов для загрузки
  }

  const tasks = resources.map((res) => ({
    title: res.absoluteUrl,
    task: () => axios.get(res.absoluteUrl, { responseType: 'arraybuffer' })
      .then((response) => {
        const filePath = path.resolve(outputDir, res.localPath);
        return fs.mkdir(path.dirname(filePath), { recursive: true })
          .then(() => fs.writeFile(filePath, response.data));
      }),
  }));

  const listr = new Listr(tasks, { concurrent: true });
  return listr.run(); // Возвращаем промис
};

export default loadResources;
