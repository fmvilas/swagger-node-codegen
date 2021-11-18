const { opts } = require("commander");

function handlebarsExt(Handlebars) {

  // Create a file in your project like this and put your handlebars extensions in here
  // include it with the -b directive
  //
  //
  // /**
  //  * Function to output the word "bar"
  //  */
  // Handlebars.registerHelper('foo', () => {
  //   return "bar";
  // });

  Handlebars.registerHelper('allcaps', (str) => {
    if (str) {
      return str.toUpperCase();
    } else {
      return '';
    }
  });

  Handlebars.registerHelper('lowercase', (str) => {
    if (str) {
      return str.toLowerCase();
    } else {
      return '';
    }
  });

  Handlebars.registerHelper('json', (str) => {
    return new Handlebars.SafeString(JSON.stringify(str, null, 5));
  });

  const typeMap = {
    'string': 'string',
    'number': 'number',
    'integer': 'number',
    'boolean': 'boolean',
    'array': 'Array<any>',
    'object': 'any',
  };

  Handlebars.registerHelper('getType', (type, models) => {
    switch (type.type) {
      case 'array':
        return new Handlebars.SafeString(`Array<${type.items.$ref.substr(('#/components/schemas/').length)}Model>`);
      case 'object':
        return type.$ref.substr(('#/components/schemas/').length) + 'Model';
      default:
        return typeMap[type.type] || 'any'
    }
  });

  Handlebars.registerHelper('ifSwaggerType', (obj, type, context, opts) => {
    if  (obj && obj.type === type) {
      return opts.fn(context);
    } else {
      return opts.inverse(context);
    }
  });

  Handlebars.registerHelper('modelsForController', (operation) => {
    const models = {};
    operation.forEach(op => {
      Object.keys(op.path)
      .filter(k => k !== 'endpointName')
      .forEach(k => {
        const responses = op.path[k].responses;
        if (responses) {
          Object.keys(responses)
            .forEach(responseKey => {
              const r = responses[responseKey];
              if (  r &&
                    r.content &&
                    r.content['application/json'] &&
                    r.content['application/json'].schema)
              {
                if (r.content['application/json'].schema.$ref) {
                  const modelName =
                    r.content['application/json'].schema.$ref.substr(('#/components/schemas/').length);
                  models[modelName] = modelName;
                }

                if (r.content['application/json'].schema.type === 'array') {
                  const modelName =
                    r.content['application/json'].schema.items.$ref.substr(('#/components/schemas/').length);
                  models[modelName] = modelName;
                }
              }
            });
        }
      });
    });
    return Object.keys(models).map (m => `${m}Model`).join(',');
  });

  Handlebars.registerHelper('colonToCurlyBrace', (path) => {
    const tokens = path.split('/');
    for (let i = 0;  i < tokens.length; i++) {
      if (tokens[i].substr(0, 1) === ':') {
        tokens[i] = `{${tokens[i].substr(1)}}`;
      }
    }

    return tokens.join('/');
  });

  Handlebars.registerHelper('debugger', (obj) => { debugger; });
}

module.exports = handlebarsExt;
