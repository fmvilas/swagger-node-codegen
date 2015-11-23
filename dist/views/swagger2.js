'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getViewForSwagger2;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _wordWrap = require('word-wrap');

var _wordWrap2 = _interopRequireDefault(_wordWrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getOperationId = function getOperationId(method_name, path_name) {
  if (path_name === '/' || path_name === '') return method_name;

  // clean url path for requests ending with '/'
  var clean_path = path_name;
  if (clean_path.indexOf('/', clean_path.length - 1) !== -1) {
    clean_path = clean_path.substring(0, clean_path.length - 1);
  }

  var segments = clean_path.split('/').slice(1);
  segments = _lodash2.default.transform(segments, function (result, segment) {
    if (segment[0] === '{' && segment[segment.length - 1] === '}') {
      segment = 'by-' + _lodash2.default.capitalize(segment.substring(1, segment.length - 1)) + '}';
    }
    result.push(segment);
  });

  return _lodash2.default.camelCase(method_name.toLowerCase() + '-' + segments.join('-'));
};

function getViewForSwagger2(swagger) {
  var authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

  swagger.basePath = swagger.basePath || '/v1';

  _lodash2.default.each(swagger.paths, function (path, path_name) {
    path.endpointName = path_name.split('/')[1];
    _lodash2.default.each(path, function (method, method_name) {
      if (authorized_methods.indexOf(method_name.toUpperCase()) === -1) return;

      method['operationId'] = method['operationId'] || getOperationId(method_name, path_name);
      method['descriptionLines'] = (0, _wordWrap2.default)(method['description'], { width: 60, indent: '' }).split(/\n/);
      _lodash2.default.each(method.parameters, function (param, param_name) {
        if (param.$ref) {
          method.parameters.push(swagger.parameters[param.$ref]);
        }
        if (_lodash2.default.result(param, 'schema.$ref')) {
          var definition = param.schema.$ref.substring('#/definitions/'.length);
          if (definition) {
            param = _lodash2.default.assign(param, swagger.definitions[definition]);
          }
        }
      });

      _lodash2.default.each(method.responses, function (response, response_code) {
        if (_lodash2.default.result(response, 'schema.$ref') && swagger.definitions) {
          var value = swagger.definitions[response.schema.$ref] || {};
          if (_lodash2.default.result(value, 'properties.message')) {
            value.properties.message.description = _lodash2.default.result(value, 'properties.message.description', method.responses[response_code].description);
          }
          method.responses[response_code].schema = value;
        }
      });
    });
  });

  swagger.endpoints = _lodash2.default.unique(_lodash2.default.pluck(swagger.paths, 'endpointName'));

  return swagger;
}