# Swagger ES6 Node.js code generator

## Description

Use your API Swagger definition to generate the Node.js ES6-compliant code of your API.

The generated code features:

* ES6
* Gulp
* Makefile
* ESLint
* YAML config file
* Express

## How to use it?

> If you want to use the CLI to generate your APIs please check
> [swagger-node-codegen-cli](https://github.com/fmvilas/swagger-node-codegen-cli)

```bash
npm install swagger-node-codegen
```

Now, in your app:

```js
var path = require('path');
var generator = require('swagger-node-codegen');
var your_api = require('./your-api.json');

generator.generate({
  swagger: your_api,
  target_dir: path.resolve(__dirname, './your-api')
});
```

or using ES6:

```js
import path from 'path';
import generator from 'swagger-node-codegen';
import your_api from './your-api.json';

generator.generate({
  swagger: your_api,
  target_dir: path.resolve(__dirname, './your-api')
});
```

## Author

Francisco Méndez Vilas ([fmvilas@gmail.com](mailto:fmvilas@gmail.com))

[www.fmvilas.com](http://www.fmvilas.com)

This project was heavily inspired by [Swagger JS Codegen](https://github.com/wcandillon/swagger-js-codegen) made by [William Candillon](https://github.com/wcandillon).
