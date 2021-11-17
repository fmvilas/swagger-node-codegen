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
}

module.exports = handlebarsExt;
