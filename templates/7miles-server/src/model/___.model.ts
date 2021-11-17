import * from './models';

{{#ifSwaggerType model 'object' this}}
interface {{model_name}}Model {
  {{#each model.properties}}
  public {{@key}}?: {{getType this ../swagger/components/schemas}};
  {{/each}}
}
{{/ifSwaggerType}}
