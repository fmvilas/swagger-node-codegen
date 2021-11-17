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
console.log('json');
  Handlebars.registerHelper('tojson', (str) => {
    return JSON.stringify(str, null, 5);
  });
  console.log('/json');
}

module.exports = handlebarsExt;
