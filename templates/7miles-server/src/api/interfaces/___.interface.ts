import { Request, ResponseToolkit } from "@hapi/hapi";

interface I{{capitalize operation_name}}Controller {


{{#each headOperation}}
  {{#each this.path}}
    {{#validMethod @key}}

/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
  public async {{@key}}{{../operationId}}(request: Request, toolkit: ResponseToolkit);

    {{/validMethod}}
  {{/each}}
{{/each}}

{{#each operation}}
  {{#each this.path}}
    {{#validMethod @key}}
  /**
  {{#each ../descriptionLines}}
  * {{{this}}}
  {{/each}}
  */
  public async {{@key}}{{../operationId}}(request: Request, toolkit: ResponseToolkit);

    {{/validMethod}}
  {{/each}}
{{/each}}
}

export { I{{capitalize operation_name}}Controller }
