<div style="text-align:center"><img src="logo.png"></div>
<div style="text-align:center;font-weight:bold;">OpenAPI Node.js<br>Code Generator</div>
<br><br>
Use your API OpenAPI 3.x/Swagger 2 definition to generate Node.js ES7-compliant code for your API.

The generated code features:

* ES7
* ESLint
* YAML config file
* Express
* No transpiling

## Install

To use it from the CLI:

```bash
npm install -g swagger-node-codegen
```

To use it as a module in your project:

```bash
npm install --save swagger-node-codegen
```

## Usage

### From the command-line interface (CLI)

```bash
  Usage: cli [options] <swaggerFile>


  Options:

    -V, --version             output the version number
    -o, --output <outputDir>  directory where to put the generated files (defaults to current directory)
    -h, --help                output usage information
```

#### Examples

The shortest possible syntax:
```bash
snc swagger.yaml
```

Specify where to put the generated code:
```bash
snc swagger.yaml -o ./my-api
```

### As a module in your project

Now, in your app:

```js
const path = require('path');
const codegen = require('swagger-node-codegen');
const swagger = require('./swagger.json');

codegen.generate({
  swagger,
  target_dir: path.resolve(__dirname, './my-api')
}).then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(`Something went wrong: ${err.message}`);
});
```

The `swagger` parameter can be either JSON or a path pointing to a JSON or YAML file.

```js
const path = require('path');
const codegen = require('swagger-node-codegen');

codegen.generate({
  swagger: path.resolve(__dirname, './swagger.yml'),
  target_dir: path.resolve(__dirname, './my-api')
}).then(() => {
  console.log('Done!');
}).catch(err => {
  console.error(`Something went wrong: ${err.message}`);
});
```
#### Using async/await

The function `codegen.generate` returns a Promise, so it means you can use async/await:

```js
const path = require('path');
const codegen = require('swagger-node-codegen');

try {
  await codegen.generate({
    swagger: path.resolve(__dirname, './swagger.yml'),
    target_dir: path.resolve(__dirname, './my-api')
  });
  console.log('Done!');
} catch (err) {
  console.error(`Something went wrong: ${err.message}`);
}
```

## Author

Fran Méndez ([fmvilas@gmail.com](mailto:fmvilas@gmail.com))

[www.fmvilas.com](http://www.fmvilas.com)
