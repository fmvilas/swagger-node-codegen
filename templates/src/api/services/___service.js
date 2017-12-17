{{#each service}}
  {{#each this.path}}
    {{#validMethod @key}}
/**
 * @param {Object} options
{{#each ../parameters}}
{{#if this.name}}
 * @param {{../../../../openbrace}}{{capitalize type}}{{../../../../closebrace}} options.{{name}} {{description}}
{{/if}}
{{/each}}
 * @throws {Error}
 * @return {Promise}
 */
module.exports.{{../operationId}} = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   code: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new Error({
  //   code: 500, // Or another error code.
  //   message: 'Server Error' // Or another error message.
  // });
};

    {{/validMethod}}
  {{/each}}
{{/each}}
