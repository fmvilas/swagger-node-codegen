const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../lib/config');
const logger = require('../lib/logger');

const log = logger(config.logger);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
 * Routes
 */
{{#endsWith @root.swagger.basePath '/'}}
{{#each swagger.endpoints}}
app.use('{{@root.swagger.basePath}}{{this}}', require('./routes/{{this}}'));
{{/each}}
{{/endsWith}}
{{#notEndsWith @root.swagger.basePath '/'}}
{{#each swagger.endpoints}}
app.use('{{@root.swagger.basePath}}/{{this}}', require('./routes/{{this}}'));
{{/each}}
{{/notEndsWith}}

// catch 404
app.use((req, res, next) => {
  log.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  log.error(`Error ${status} (${err.message}) on ${req.method} ${req.url} with payload ${req.body}.`);
  res.status(status).send({ status, error: 'Server error' });
});

module.exports = app;
