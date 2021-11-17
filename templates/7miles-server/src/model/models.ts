{{#each swagger.components.schemas}}
import {{@key}} from './{{@key}}.model.ts';
{{/each}}

export { {{#each swagger.components.schemas}}{{@key}},{{/each}} }
