/**
 * This module is used to accommodate Swagger 2 data for easier rendering.
 * @module swagger2
 */

const _ = require('lodash');
const wrap = require('word-wrap');
const YAML = require('yamljs');
const jsonfile = require('jsonfile');

/**
 * Loads a YAML or JSON file.
 *
 * @param  {String} path Path to file.
 * @return {Object}      The file content as a JS object.
 */
const loadFile = function (path) {
  if (path.match(/\.ya?ml$/)) {
    return YAML.load(path);
  }

  return jsonfile.readFileSync(path);
};

/**
 * Generates an "operationId" attribute based on path and method names.
 *
 * @private
 * @param  {String} method_name HTTP method name.
 * @param  {String} path_name   Path name.
 * @return {String}
 */
const generateOperationId = (method_name, path_name) => {
  if (path_name === '/') return method_name;

  // clean url path for requests ending with '/'
  let clean_path = path_name;
  if (clean_path.indexOf('/', clean_path.length - 1) !== -1) {
    clean_path = clean_path.substring(0, clean_path.length - 1);
  }

  let segments = clean_path.split('/').slice(1);
  segments = _.transform(segments, (result, segment) => {
    if (segment[0] === '{' && segment[segment.length - 1] === '}') {
      segment = `by-${_.capitalize(segment.substring(1, segment.length - 1))}}`;
    }
    result.push(segment);
  });

  return _.camelCase(`${method_name.toLowerCase()}-${segments.join('-')}`);
};

/**
 * Accommodates Swagger object for easier rendering.
 *
 * @param  {Object} swagger Swagger JS object.
 * @return {Object}         The accommodated Swagger object.
 */
const swagger2 = swagger => {
  const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

  if (typeof swagger === 'string') {
    swagger = loadFile(swagger);
  } else if (typeof swagger !== 'object') {
    throw new Error(`Could not find a valid swagger definition: ${swagger}`);
  }

  swagger.basePath = swagger.basePath || '';

  _.each(swagger.paths, (path, path_name) => {
    path.endpointName = path_name === '/' ? 'root' : path_name.split('/')[1];
    _.each(path, (method, method_name) => {
      if (authorized_methods.indexOf(method_name.toUpperCase()) === -1) return;

      method['operationId'] = method['operationId'] || generateOperationId(method_name, path_name);
      method['descriptionLines'] = wrap(method['description'] || method['summary'] || '', { width: 60, indent: '' }).split(/\n/);
      _.each(method.parameters, (param) => {
        if (param.$ref) {
          method.parameters.push(swagger.parameters[param.$ref]);
        }
        if (_.result(param, 'schema.$ref')) {
          const definition = param.schema.$ref.substring('#/definitions/'.length);
          if (definition) {
            param = _.assign(param, swagger.definitions[definition]);
          }
        }
      });

      _.each(method.responses, (response, response_code) => {
        if (_.result(response, 'schema.$ref') && swagger.definitions) {
          const value = swagger.definitions[response.schema.$ref] || {};
          if (_.result(value, 'properties.message')) {
            value.properties.message.description = _.result(value, 'properties.message.description', method.responses[response_code].description);
          }
          method.responses[response_code].schema = value;
        }
      });
    });
  });

  swagger.endpoints = _.unique(_.pluck(swagger.paths, 'endpointName'));

  return swagger;
};

module.exports = swagger2;
