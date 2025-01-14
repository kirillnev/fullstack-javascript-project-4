#!/usr/bin/env node

import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('CLI utility for downloading web pages and resources.')
  .version('1.0.0')
  .option('-o, --output [dir]', 'output directory', process.cwd())
  .argument('<url>')
  .action((url, options) => {
    pageLoader(url, options)
      .then((filePath) => {
        console.log(filePath);
        process.exit(0); // успешное завершение
      })
      .catch((err) => {
        console.error(`Error: ${err.message}`);
        process.exit(1); // завершение с ошибкой
      });
  });

program.parse(process.argv);
