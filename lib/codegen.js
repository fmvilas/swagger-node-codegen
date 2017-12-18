/**
 * This module generates a code skeleton for an API using Swagger.
 * @module codegen
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const _ = require('lodash');
const swagger2 = require('./swagger2');
const xfs = require('fs.extra');
const randomName = require('project-name-generator');

const codegen = module.exports;

require('./helpers/handlebars');

/**
 * Generates a route file.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
const generateRoute = (config, endpoint, endpoint_name) => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/routes/___route.js'), 'utf8', (err, data) => {
    if (err) return reject(err);

    try {
      const target_file = path.resolve(config.target_dir, 'src/api/routes/', `${endpoint_name.replace(/[}{]/g, '')}.js`);
      const template = Handlebars.compile(data.toString());
      const content = template({
        service_name: endpoint_name.replace(/[}{]/g, ''),
        endpoint
      });

      fs.writeFile(target_file, content, 'utf8', (err) => {
        if (err) return reject(err);
        resolve();
      });
    } catch (e) {
      if (e) return reject(e);
    }
  });
});

/**
 * Generates all the routes files.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
const generateRoutes = config => new Promise((resolve, reject) => {
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
      subresource: (path_name.substring(endpoint_name.length+1) || '/').replace('}', '').replace('{', ':')
    });
  });

  Promise.all(
    _.map(endpoints, (endpoint, endpoint_name) => generateRoute(config, endpoint, endpoint_name))
  ).then(resolve).catch(reject);
});

/**
 * Generates a service file.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
const generateService = (config, service, service_name) => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(__dirname, '../templates/src/api/services/___service.js'), 'utf8', (err, data) => {
    if (err) return reject(err);

    const target_file = path.resolve(config.target_dir, 'src/api/services/', `${service_name}.js`);
    const template = Handlebars.compile(data.toString());
    const content = template({ service, openbrace: '{', closebrace: '}' });

    fs.writeFile(target_file, content, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

/**
 * Generates all the services files.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
const generateServices = config => new Promise((resolve, reject) => {
  const services = {};

  _.each(config.swagger.paths, (path, path_name) => {
    const service_name = path_name === '/' ? 'root' : path_name.split('/')[1].replace(/[}{]/g, '');

    if (services[service_name] === undefined) {
      services[service_name] = [];
    }

    services[service_name].push({ path });
  });

  Promise.all(
    _.map(services, (service, service_name) => generateService(config, service, service_name))
  ).then(resolve).catch(reject);
});

/**
 * Generates a file.
 *
 * @private
 * @param  {Object} options
 * @param  {String} options.templates_dir Directory where the templates live.
 * @param  {String} options.target_dir    Directory where the file will be generated.
 * @param  {String} options.file_name     Name of the generated file.
 * @param  {String} options.root          Root directory.
 * @param  {Object} options.data          Data to pass to the template.
 * @return {Promise}
 */
const generateFile = options => new Promise((resolve, reject) => {
  const templates_dir = options.templates_dir;
  const target_dir = options.target_dir;
  const file_name = options.file_name;
  const root = options.root;
  const data = options.data;

  fs.readFile(path.resolve(root, file_name), 'utf8', (err, content) => {
    if (err) return reject(err);

    try {
      const template = Handlebars.compile(content);
      const parsed_content = template(data);
      const template_path = path.relative(templates_dir, path.resolve(root, file_name));
      const generated_path = path.resolve(target_dir, template_path);

      fs.writeFile(generated_path, parsed_content, 'utf8', (err) => {
        if (err) return reject(err);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
});

/**
 * Generates the directory structure.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
const generateDirectoryStructure = config => new Promise((resolve, reject) => {
  const target_dir = config.target_dir;
  const templates_dir = path.resolve(__dirname, '../templates');

  xfs.mkdirpSync(target_dir);

  xfs.copyRecursive(templates_dir, target_dir, (err) => {
    if (err) return reject(err);

    const walker = xfs.walk(templates_dir, {
      followLinks: false
    });

    walker.on('file', async (root, stats, next) => {
      try {
        if (stats.name.substr(0,3) === '___') {
          const template_path = path.relative(templates_dir, path.resolve(root, stats.name));
          fs.unlink(path.resolve(target_dir, template_path), next);
        } else {
          await generateFile({
            root,
            templates_dir,
            target_dir,
            data: config,
            file_name: stats.name
          });
          next();
        }
      } catch (e) {
        reject(e);
      }
    });

    walker.on('errors', (root, nodeStatsArray) => {
      reject(nodeStatsArray);
    });

    walker.on('end', async () => {
      try {
        await generateRoutes(config);
        await generateServices(config);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
});

/**
 * Generates a code skeleton for an API given a Swagger file.
 *
 * @module codegen.generate
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
codegen.generate = config => new Promise((resolve, reject) => {
  swagger2(config.swagger).then(swagger => {
    const random_name = randomName().dashed;
    config.swagger = swagger;

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

    generateDirectoryStructure(config).then(resolve).catch(reject);
  }).catch(reject);
});
