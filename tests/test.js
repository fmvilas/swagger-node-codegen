import path from 'path';
import generator from '../dist/codegen.js';
import uber_api from './uber.json';

generator.generate({
  swagger: path.resolve(__dirname, 'iris.yml'),
  target_dir: path.resolve(__dirname, 'generated-yaml/')
});

generator.generate({
  swagger: path.resolve(__dirname, 'uber.json'),
  target_dir: path.resolve(__dirname, 'generated-json/')
});

generator.generate({
  swagger: uber_api,
  target_dir: path.resolve(__dirname, 'generated/')
});
