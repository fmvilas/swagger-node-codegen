'use strict';

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _swagger = require('./views/swagger2.js');

var _swagger2 = _interopRequireDefault(_swagger);

var _fs3 = require('fs.extra');

var _fs4 = _interopRequireDefault(_fs3);

var _projectNameGenerator = require('project-name-generator');

var _projectNameGenerator2 = _interopRequireDefault(_projectNameGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./helpers/handlebars');

function generateEndpoints(config) {
  var endpoints = {};

  _lodash2.default.each(config.swagger.paths, function (path, path_name) {
    var endpoint_name = path.endpointName;

    if (endpoints[endpoint_name] === undefined) {
      endpoints[endpoint_name] = [];
    }

    path_name = path_name.replace('}', '').replace('{', ':');

    endpoints[endpoint_name].push({
      path_name: path_name,
      path: path,
      subresource: path_name.substring(endpoint_name.length + 1) || '/'
    });
  });

  _lodash2.default.each(endpoints, function (endpoint, endpoint_name) {
    generateEndpoint(config, endpoint, endpoint_name);
  });
}

function generateEndpoint(config, endpoint, endpoint_name) {
  _fs2.default.readFile(_path2.default.resolve(__dirname, '../templates/src/api/routes/___route.js'), 'utf8', function (err, data) {
    if (err) throw err;

    var target_file = _path2.default.resolve(config.target_dir, 'src/api/routes/', endpoint_name + '.js');
    var template = _handlebars2.default.compile(data.toString());
    var content = template({
      service_name: endpoint_name,
      endpoint: endpoint
    });

    _fs2.default.writeFile(target_file, content, 'utf8', function (err) {
      if (err) throw err;
    });
  });
}

function generateServices(config) {
  var services = {};

  _lodash2.default.each(config.swagger.paths, function (path, path_name) {
    var service_name = path_name.split('/')[1];

    if (services[service_name] === undefined) {
      services[service_name] = [];
    }

    services[service_name].push({ path: path });
  });

  _lodash2.default.each(services, function (service, service_name) {
    generateService(config, service, service_name);
  });
}

function generateService(config, service, service_name) {
  _fs2.default.readFile(_path2.default.resolve(__dirname, '../templates/src/api/services/___service.js'), 'utf8', function (err, data) {
    if (err) throw err;

    var target_file = _path2.default.resolve(config.target_dir, 'src/api/services/', service_name + '.js');
    var template = _handlebars2.default.compile(data.toString());
    var content = template({ service: service, openbrace: '{', closebrace: '}' });

    _fs2.default.writeFile(target_file, content, 'utf8', function (err) {
      if (err) throw err;
    });
  });
}

function generateFile(options, next) {
  var templates_dir = options.templates_dir;
  var target_dir = options.target_dir;
  var file_name = options.file_name;
  var root = options.root;
  var data = options.data;

  _fs2.default.readFile(_path2.default.resolve(root, file_name), 'utf8', function (err, content) {
    if (err) throw err;

    var template = _handlebars2.default.compile(content);
    var parsed_content = template(data);
    var template_path = _path2.default.relative(templates_dir, _path2.default.resolve(root, file_name));
    var generated_path = _path2.default.resolve(target_dir, template_path);

    _fs2.default.writeFile(generated_path, parsed_content, 'utf8', function (err) {
      if (err) throw err;
      next();
    });
  });
}

function generateDirectoriesStructure(config) {
  var target_dir = config.target_dir;
  var templates_dir = _path2.default.resolve(__dirname, '../templates');

  _fs4.default.rmrfSync(target_dir);
  _fs4.default.mkdirpSync(target_dir);

  _fs4.default.copyRecursive(templates_dir, target_dir, function (err) {
    if (err) throw err;

    var walker = _fs4.default.walk(templates_dir, {
      followLinks: false
    });

    walker.on('file', function (root, stats, next) {
      if (stats.name.substr(0, 3) === '___') {
        var template_path = _path2.default.relative(templates_dir, _path2.default.resolve(root, stats.name));
        _fs2.default.unlink(_path2.default.resolve(target_dir, template_path));
        next();
      } else {
        generateFile({
          root: root,
          templates_dir: templates_dir,
          target_dir: target_dir,
          data: config,
          file_name: stats.name
        }, next);
      }
    });

    walker.on('errors', function (root, nodeStatsArray, next) {
      console.error(nodeStatsArray);
      next();
    });

    walker.on('end', function () {
      generateEndpoints(config);
      generateServices(config);
    });
  });
}

module.exports.generate = function (config, callback) {
  var random_name = (0, _projectNameGenerator2.default)().dashed;

  try {
    config.swagger = (0, _swagger2.default)(config.swagger);
  } catch (e) {
    return callback(e);
  }

  _lodash2.default.defaultsDeep(config, {
    swagger: {
      info: {
        title: random_name
      }
    },
    package: {
      name: _lodash2.default.kebabCase(_lodash2.default.result(config, 'swagger.info.title', random_name))
    },
    target_dir: _path2.default.resolve(_os2.default.tmpdir(), 'swagger-node-generated-code')
  });

  try {
    generateDirectoriesStructure(config);
  } catch (e) {
    return callback(e);
  }

  return callback(null);
};