import os from 'os';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import _ from 'lodash';
import swagger2View from './views/swagger2.js';
import xfs from 'fs.extra';
import randomName from 'project-name-generator';

Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper equal needs 2 parameters');
  if (lvalue!=rvalue) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('match', (lvalue, rvalue, options) => {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper match needs 2 parameters');
  if (!lvalue.match(rvalue)) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('compare', (lvalue, rvalue, options) => {
  if (arguments.length < 3) throw new Error('Handlerbars Helper "compare" needs 2 parameters');

  const operator = options.hash.operator || '==';
  const operators = {
    '==':       (l,r) => { return l == r; },
    '===':      (l,r) => { return l === r; },
    '!=':       (l,r) => { return l != r; },
    '<':        (l,r) => { return l < r; },
    '>':        (l,r) => { return l > r; },
    '<=':       (l,r) => { return l <= r; },
    '>=':       (l,r) => { return l >= r; },
    typeof:     (l,r) => { return typeof l == r; }
  };

  if (!operators[operator]) throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);

  const result = operators[operator](lvalue,rvalue);

  if (result) {
    return options.fn(this);
  }

  return options.inverse(this);
});

function generateEndpoints (config) {
  const endpoints = {};

  _.each(config.swagger.paths, (path, path_name) => {
    const endpoint_name = path_name.split('/')[1];

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
  fs.readFile(path.resolve(__dirname, 'templates/src/api/routes/___route.js'), 'utf8', (err, data) => {
    if (err) throw err;

    const target_file = path.resolve(config.generated_dir, 'src/api/routes/', `${endpoint_name}.js`);
    const template = Handlebars.compile(data.toString());
    const content = template({
      service_name: endpoint_name,
      endpoint
    });

    fs.writeFile(target_file, content, 0, 'utf8', (err) => {
      if (err) throw err;
    });
  });
}

function generateFile (options, next) {
  const templates_dir = options.templates_dir;
  const generated_dir = options.generated_dir;
  const file_name = options.file_name;
  const root = options.root;
  const data = options.data;

  fs.readFile(path.resolve(root, file_name), 'utf8', (err, content) => {
    if (err) throw err;

    const template = Handlebars.compile(content);
    const parsed_content = template(data);
    const template_path = path.relative(templates_dir, path.resolve(root, file_name));
    const generated_path = path.resolve(generated_dir, template_path);

    fs.writeFile(generated_path, parsed_content, 0, 'utf8', (err) => {
      if (err) throw err;
      next();
    });
  });
}

function generateDirectoriesStructure (config) {
  const generated_dir = config.generated_dir;
  const templates_dir = path.resolve(__dirname, 'templates');

  xfs.rmrfSync(generated_dir);
  xfs.mkdirpSync(generated_dir);

  xfs.copyRecursive(templates_dir, generated_dir, (err) => {
    if (err) throw err;

    const walker = xfs.walk(templates_dir, {
      followLinks: false
    });

    walker.on('file', (root, stats, next) => {
      if (stats.name.substr(0,3) === '___') {
        const template_path = path.relative(templates_dir, path.resolve(root, stats.name));
        fs.unlink(path.resolve(generated_dir, template_path));
        next();
      } else {
        generateFile({
          root,
          templates_dir,
          generated_dir,
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
    });
  });
}

module.exports.generate = function (config) {
  const random_name = randomName().dashed;

  swagger2View(config.swagger);

  _.defaultsDeep(config, {
    swagger: {
      info: {
        title: random_name
      }
    },
    package: {
      name: _.kebabCase(_.result(config, 'swagger.info.title', random_name))
    },
    generated_dir: path.resolve(os.tmpdir(), 'swagger-node-generated-code')
  });

  generateDirectoriesStructure(config);
};
