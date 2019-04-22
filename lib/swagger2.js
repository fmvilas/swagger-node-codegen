/**
 * This module is used to accommodate Swagger 2 data for easier rendering.
 * @module swagger2
 */

const _ = require('lodash');
const wrap = require('word-wrap');
const bundler = require('./bundler');

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
 * @param  {String|Object} swagger File path to Swagger file or **fully bundled and dereferenced** Swagger JS object.
 * @return {Object}                The accommodated Swagger object.
 */
const swagger2 = async swagger => {
  const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

  if (typeof swagger === 'string') {
    try {
      swagger = await bundler(swagger);
    } catch (e) {
      throw e;
    }
  } else if (typeof swagger !== 'object') {
    throw new Error(`Could not find a valid swagger definition: ${swagger}`);
  }

  swagger.basePath = swagger.basePath || '';

  _.each(swagger.paths, (path, path_name) => {
    path.endpointName = path_name === '/' ? 'root' : path_name.split('/')[1];
    _.each(path, (method, method_name) => {
      if (authorized_methods.indexOf(method_name.toUpperCase()) === -1) return;

      method.operationId = _.camelCase(method.operationId || generateOperationId(method_name, path_name).replace(/\s/g, '-'));
      method.descriptionLines = wrap(method.description || method.summary || '', { width: 60, indent: '' }).split(/\n/);
      _.each(method.parameters, param => {
        param.type = param.type || (param.schema ? param.schema.type : undefined);
      });
    });
  });

  swagger.endpoints = _.uniq(_.map(swagger.paths, 'endpointName'));

  return swagger;
};

module.exports = swagger2;
