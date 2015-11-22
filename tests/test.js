import path from 'path';
import generator from '../dist/codegen.js';
import uber_api from './uber.json';

generator.generate({
  swagger: uber_api,
  target_dir: path.resolve(__dirname, 'generated/')
});
