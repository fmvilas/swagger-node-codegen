import { Container } from 'inversify';
import { TYPES } from './types';
{{#each swagger.endpoints}}
import { {{capitalize this}}Controller } from "./{{this}}.controller";
{{/each}}

function bindControllers(container: Container): void {
  {{#each swagger.endpoints}}
  container.bind<{{capitalize this}}Controller>(TYPES.{{capitalize this}}Controller).to({{capitalize this}}Controller).inSingletonScope();
  {{/each}}
}

export { bindControllers }
