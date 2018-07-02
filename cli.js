#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const packageInfo = require('./package.json');
const codegen = require('./lib/codegen');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let swaggerFile;

const parseOutput = dir => path.resolve(dir);

program
  .version(packageInfo.version)
  .arguments('<swaggerFile>')
  .action((swaggerFilePath) => {
    swaggerFile = path.resolve(swaggerFilePath);
  })
  .option('-b, --handlebars <helperFilePath>', 'path to external handlebars helpers file (defaults to empty)', parseOutput)
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-t, --templates <templateDir>', 'directory where templates are located (defaults to internal nodejs templates)')
  .parse(process.argv);

if (!swaggerFile) {
  console.error(red('> Path to Swagger file not provided.'));
  program.help(); // This exits the process
}

codegen.generate({
  swagger: swaggerFile,
  target_dir: program.output,
  templates: program.templates ? path.resolve(process.cwd(), program.templates) : undefined,
  handlebars_helper: program.handlebars ? path.resolve(process.cwd(), program.handlebars) : undefined
}).then(() => {
  console.log(green('Done! ✨'));
  console.log(yellow('Check out your shiny new API at ') + magenta(program.output) + yellow('.'));
}).catch(err => {
  console.error(red('Aaww 💩. Something went wrong:'));
  console.error(red(err.stack || err.message));
});

process.on('unhandledRejection', (err) => console.error(err));
