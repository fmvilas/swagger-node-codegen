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
        return new Handlebars.SafeString(`Array<${type.items.$ref.substr(('#/components/schemas/').length)}>`);
      case 'object':
        return type.$ref.substr(('#/components/schemas/').length);
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

  Handlebars.registerHelper('debugger', (obj) => { debugger; });
}

module.exports = handlebarsExt;
