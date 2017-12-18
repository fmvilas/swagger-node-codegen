import path from 'path';
import generator from '../dist/codegen.js';
import uber_api from './uber.json';

generator.generate({
  swagger: path.resolve(__dirname, 'iris.yml'),
  target_dir: path.resolve(__dirname, 'generated-yaml/')
}, (err) => {
  if (err) console.log(err.message);
});

generator.generate({
  swagger: path.resolve(__dirname, 'irisdd.yml'),
  target_dir: path.resolve(__dirname, 'generated-yaml/')
}, (err) => {
  if (err) console.log('There should be an error here -> ', err.message);
});

generator.generate({
  swagger: path.resolve(__dirname, 'uber.json'),
  target_dir: path.resolve(__dirname, 'generated-json/')
}, (err) => {
  if (err) console.log(err.message);
});

generator.generate({
  swagger: uber_api,
  target_dir: path.resolve(__dirname, 'generated/')
}, (err) => {
  if (err) console.log(err.message);
});

generator.generate({
  swagger: path.resolve(__dirname, 'missing_description.yml'),
  target_dir: path.resolve(__dirname, 'generated-with-missing-description')
}, (err) => {
  if (err) console.log(err.message);
});
