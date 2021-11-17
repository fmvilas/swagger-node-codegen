import * from './models';

{{#ifSwaggerType model 'object' this}}
interface {{model_name}} {
  {{#each model.properties}}
  public {{@key}}: {{getType this ../swagger/components/schemas}};
  {{/each}}
}
{{/ifSwaggerType}}
