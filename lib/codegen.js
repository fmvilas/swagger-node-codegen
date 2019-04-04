/**
 * This module generates a code skeleton for an API using OpenAPI/Swagger.
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
 * Generates a file for every operation.
 *
 * @param config
 * @param operation
 * @param operation_name
 * @returns {Promise}
 */
const generateOperationFile = (config, operation, operation_name) => new Promise((resolve, reject) => {
  let headOperation = [];
  const operations_no_head = JSON.parse(JSON.stringify(operation));
  operations_no_head.forEach(op => {
    if(op.path.head) {
      const obj = Object.assign({}, op);

      obj.path = {
        head: obj.path.head,
        endpointName: obj.path.endpointName
      };

      delete op.path.head;
      headOperation.push(Object.assign({}, obj));
    }
  });

  fs.readFile(path.join(config.root, config.file_name), 'utf8', (err, data) => {
    if (err) return reject(err);
    const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`),'');
    const new_filename = config.file_name.replace('___', operation_name);
    const target_file = path.resolve(config.target_dir, subdir, new_filename);
    const template = Handlebars.compile(data.toString());

    const content = template({
      openbrace: '{',
      closebrace: '}' ,
      operation_name: operation_name.replace(/[}{]/g, ''),
      operation: config.root.endsWith('routes') ? operations_no_head : operation,
      headOperation,
      swagger: config.data.swagger
    });

    fs.writeFile(target_file, content, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

/**
 * Generates all the files for each operation by iterating over the operations.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
const generateOperationFiles = config => new Promise((resolve, reject) => {
  const files = {};
  _.each(config.data.swagger.paths, (path, path_name) => {
    const operation_name = path.endpointName;
    if (files[operation_name] === undefined) {
      files[operation_name] = [];
    }

    path_name = path_name.replace(/}/g, '').replace(/{/g, ':');

    files[operation_name].push({
      path_name,
      path,
      subresource: (path_name.substring(operation_name.length+1) || '/').replace(/}/g, '').replace(/{/g, ':')
    });

    Promise.all(
      _.map(files, (operation, operation_name) => generateOperationFile(config, operation, operation_name))
    ).then(resolve).catch(reject);
  });
});

/**
 * Generates the directory structure.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger Swagger JSON or a string pointing to a Swagger file.
 * @param  {String}        config.target_dir Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates Absolute path to the templates that should be used.
 * @return {Promise}
 */
const generateDirectoryStructure = config => new Promise((resolve, reject) => {
  const target_dir = config.target_dir;
  const templates_dir = config.templates;

  xfs.mkdirpSync(target_dir);

  xfs.copyRecursive(templates_dir, target_dir, (err) => {
    if (err) return reject(err);

    const walker = xfs.walk(templates_dir, {
      followLinks: false
    });

    walker.on('file', async (root, stats, next) => {
      try {
        if (stats.name.substr(0,3) === '___') {
          // this file should be handled for each in swagger.paths
          await generateOperationFiles({
            root,
            templates_dir,
            target_dir,
            data: config,
            file_name: stats.name
          });
          const template_path = path.relative(templates_dir, path.resolve(root, stats.name));
          fs.unlink(path.resolve(target_dir, template_path), next);
          next();
        } else {
          // this file should only exist once.
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
      resolve();
    });
  });
});

/**
 * Generates a code skeleton for an API given an OpenAPI/Swagger file.
 *
 * @module codegen.generate
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.swagger OpenAPI/Swagger JSON or a string pointing to an OpenAPI/Swagger file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
codegen.generate = config => new Promise((resolve, reject) => {
  if (config.handlebars_helper) {
    let handlebarsExt = require(config.handlebars_helper);
    handlebarsExt(Handlebars);
  }
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
      target_dir: path.resolve(os.tmpdir(), 'swagger-node-generated-code'),
      templates: path.resolve(__dirname, '../templates/express-server')
    });

    generateDirectoryStructure(config).then(resolve).catch(reject);
  }).catch(reject);
});
