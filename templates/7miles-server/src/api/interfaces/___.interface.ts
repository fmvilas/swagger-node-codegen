interface I{{capitalize operation_name}}Controller {


{{#each headOperation}}
  {{#each this.path}}
    {{#validMethod @key}}

/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
//This is a head operation

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
  /**
  {{#each ../descriptionLines}}
  * {{{this}}}
  {{/each}}
  */

  /**
   * {{this}}
   */
  public async {{@key}}{{capitalize this.operationId}}(request: Request, toolkit: ResponseToolkit);

    {{/validMethod}}
  {{/each}}
{{/each}}
}

export { I{{capitalize operation_name}}Controller }
