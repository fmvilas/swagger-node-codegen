import os from 'os';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import _ from 'lodash';
import swagger2View from './views/swagger2.js';
import xfs from 'fs.extra';
import randomName from 'project-name-generator';

require('./helpers/handlebars');

function generateEndpoints (config) {
  const endpoints = {};

  _.each(config.swagger.paths, (path, path_name) => {
    const endpoint_name = path.endpointName;

    if (endpoints[endpoint_name] === undefined) {
      endpoints[endpoint_name] = [];
    }

    path_name = path_name.replace('}', '').replace('{', ':');

    endpoints[endpoint_name].push({
      path_name,
      path,
      subresource: path_name.substring(endpoint_name.length+1) || '/'
    });
  });

  _.each(endpoints, (endpoint, endpoint_name) => {
    generateEndpoint(config, endpoint, endpoint_name);
  });
}

function generateEndpoint (config, endpoint, endpoint_name) {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/routes/___route.js'), 'utf8', (err, data) => {
    if (err) throw err;

    const target_file = path.resolve(config.target_dir, 'src/api/routes/', `${endpoint_name}.js`);
    const template = Handlebars.compile(data.toString());
    const content = template({
      service_name: endpoint_name,
      endpoint
    });

    fs.writeFile(target_file, content, 'utf8', (err) => {
      if (err) throw err;
    });
  });
}

function generateServices (config) {
  const services = {};

  _.each(config.swagger.paths, (path, path_name) => {
    const service_name = path_name.split('/')[1];

    if (services[service_name] === undefined) {
      services[service_name] = [];
    }

    services[service_name].push({ path });
  });

  _.each(services, (service, service_name) => {
    generateService(config, service, service_name);
  });
}

function generateService (config, service, service_name) {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/services/___service.js'), 'utf8', (err, data) => {
    if (err) throw err;

    const target_file = path.resolve(config.target_dir, 'src/api/services/', `${service_name}.js`);
    const template = Handlebars.compile(data.toString());
    const content = template({ service, openbrace: '{', closebrace: '}' });

    fs.writeFile(target_file, content, 'utf8', (err) => {
      if (err) throw err;
    });
  });
}

function generateFile (options, next) {
  const templates_dir = options.templates_dir;
  const target_dir = options.target_dir;
  const file_name = options.file_name;
  const root = options.root;
  const data = options.data;

  fs.readFile(path.resolve(root, file_name), 'utf8', (err, content) => {
    if (err) throw err;

    const template = Handlebars.compile(content);
    const parsed_content = template(data);
    const template_path = path.relative(templates_dir, path.resolve(root, file_name));
    const generated_path = path.resolve(target_dir, template_path);

    fs.writeFile(generated_path, parsed_content, 'utf8', (err) => {
      if (err) throw err;
      next();
    });
  });
}

function generateDirectoriesStructure (config) {
  const target_dir = config.target_dir;
  const templates_dir = path.resolve(__dirname, '../templates');

  xfs.rmrfSync(target_dir);
  xfs.mkdirpSync(target_dir);

  xfs.copyRecursive(templates_dir, target_dir, (err) => {
    if (err) throw err;

    const walker = xfs.walk(templates_dir, {
      followLinks: false
    });

    walker.on('file', (root, stats, next) => {
      if (stats.name.substr(0,3) === '___') {
        const template_path = path.relative(templates_dir, path.resolve(root, stats.name));
        fs.unlink(path.resolve(target_dir, template_path));
        next();
      } else {
        generateFile({
          root,
          templates_dir,
          target_dir,
          data: config,
          file_name: stats.name
        }, next);
      }
    });

    walker.on('errors', (root, nodeStatsArray, next) => {
      console.error(nodeStatsArray);
      next();
    });

    walker.on('end', () => {
      generateEndpoints(config);
      generateServices(config);
    });
  });
}

module.exports.generate = function (config, callback) {
  const random_name = randomName().dashed;

  try {
    config.swagger = swagger2View(config.swagger);
  } catch (e) {
    return callback(e);
  }

  _.defaultsDeep(config, {
    swagger: {
      info: {
        title: random_name
      }
    },
    package: {
      name: _.kebabCase(_.result(config, 'swagger.info.title', random_name))
    },
    target_dir: path.resolve(os.tmpdir(), 'swagger-node-generated-code')
  });

  try {
    generateDirectoriesStructure(config);
  } catch (e) {
    return callback(e);
  }

  return callback(null);
};
