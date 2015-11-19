import path from 'path';
import generator from '../lib/codegen.js';
import uber_api from './uber.json';

generator.generate({
  swagger: uber_api,
  generated_dir: path.resolve(__dirname, 'generated')
});
