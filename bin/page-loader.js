#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0');

program
  .arguments('<url>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((url) => {
    const options = program.opts();

    pageLoader(url, options.output)
      .then((filePath) => {
        console.log(filePath);
      })
      .catch((err) => {
        console.error(err.message);
        process.exit(1);
      });
  });

program.parse();
