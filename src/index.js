import { promises as fs } from 'fs';
import downloadPage from './loader/pageLoader.js';
import processHtml from './loader/domProcessor.js';
import loadResources from './loader/resourceLoader.js';

function pageLoader(url, options) {
  const outputDir = options.output;

  return downloadPage(url, outputDir)
    .then((htmlFilePath) => fs.readFile(htmlFilePath, 'utf8')
      .then((htmlContent) => ({ htmlFilePath, htmlContent })))
    .then(({ htmlFilePath, htmlContent }) => {
      const { html: updatedHtml, resources } = processHtml(htmlContent, url);
      // console.log(`Total resources found: ${resources.length}`);

      return fs.writeFile(htmlFilePath, updatedHtml, 'utf8')
        .then(() => ({ htmlFilePath, resources }));
    })
    .then(({ htmlFilePath, resources }) => loadResources(resources, outputDir)
      .then(() => htmlFilePath));
}

export default pageLoader;
