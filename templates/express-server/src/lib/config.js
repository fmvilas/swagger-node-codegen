const path = require('path');
const yaml_config = require('node-yaml-config');

const config = yaml_config.load(path.join(__dirname, '../../config/common.yml'));

module.exports = config;
