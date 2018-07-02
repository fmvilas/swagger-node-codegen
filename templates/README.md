# Templates

## Creating your own templates
Templates are the sources where the code will be generated from. They 
already contain the basic skeleton code and some placeholders, that will
be replaced during the code generation process by concrete names from 
the Swagger/OpenAPI Spec. 
There are three possible different types of template files:
1. Static Code: They only contain working code. Those files will 
be simply copied to the output directory.
2. Static templates: Those files will exist only once in the output. 
Their content will simply modified once according to the placeholders.
3. Abstract templates: Those templates will produce one file per 
operation/path, so there will be one template, but many output files.

Assuming we have the following OpenAPI Spec: 
```
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pet:
    get:...
    post:...
  /pet/{petId}:
    get:...
  /user/login:
    post:...
  /user/{username}:
    get:...
    put:...
    delete:...
...
```
And some template files like this:
```
|- index.js            // This file contains static code, e.g. starting a webserver and including ./api/index.js
|+ api/
 |- index.js           // This is a static template, it contains placeholders that will be filled in, e.g. includes for each file in routes
 |+ routes/
  |- ___.route.js      // This file will be generated for each operation and contains skeleton code for each method for an operation.
```
The first important thing to notice here is the triple underscore in `___.route.js`. It will be replaced by the name of the path.

In this example the generated directory structure will be like this:
```
|- index.js            // This file still contains static code like before.
|+ api/
 |- index.js           // This file will now e.g. have included the two files in routes.
 |+ routes/
  |- pet.route.js      // This file contains the code for methods on pets. 
  |                    // (e.g. getPet, postPet, getPetByPetId). 
  |- user.route.js     // This file will contain the code for methods on users. 
                       // (e.g. postUserLogin, getUserByUsername, putUserByUsername, deleteUserByUsername). 
```

## Template file content
The templates will be rendered into working code using 
[handlebars](http://handlebarsjs.com/), so they use the template 
language of handlebars.
The code generator passes the Swagger/OpenAPI Spec to handlebars, so all
information should be available there. In addition to that, the code 
generator adds a bit [more data](#data-that-is-passed-into-handlebars) that can be helpful. Also some
[additional handlebars helpers](#additional-handlebars-helpers) exist.
### Examples:
#### Dynamically require files in JavaScript
```
{{#each @root.swagger.endpoints}}
const {{.}} = require('./routes/{{.}}.route.js')
{{/each}}
```
will produce (using the OAS Spec example from above):
```
const pet = require('./routes/pet.route.js')
const user = require('./routes/user.route.js')
```

## Data that is passed into handlebars
| Param | Type | Description |
| --- | --- | --- |
|swagger|object|The Swagger/OA Spec.|
|swagger.endpoints| object | All first level endpoints (e.g  `pet` and `user`) |

## Additional handlebars helpers
All additional Handlebars helpers are located in [`lib/helpers/handlebars`](https://github.com/fmvilas/swagger-node-codegen/blob/master/lib/helpers/handlebars.js).

## Custom handlebars helpers
Add your own handlebars helpers [`lib/helpers/handlebars/extension`](https://github.com/fmvilas/swagger-node-codegen/blob/master/lib/helpers/extension.js)
