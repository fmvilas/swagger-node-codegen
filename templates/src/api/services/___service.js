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
 * @param {Function} callback
 */
export function {{../operationId}} (options, callback) {
  // Implement you business logic here...
}

    {{/validMethod}}
  {{/each}}
{{/each}}
