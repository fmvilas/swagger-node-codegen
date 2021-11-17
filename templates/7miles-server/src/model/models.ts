{{#each swagger.components.schemas}}
import { {{@key}}Model } from './{{@key}}.model.ts';
{{/each}}

export { {{#each swagger.components.schemas}}{{@key}}Model,{{/each}} }
