import path from 'path';
import yaml_config from 'node-yaml-config';

const config = yaml_config.load(path.join(__dirname, '../../config/common.yml'));

module.exports = config;
