import express from 'express';
import {{service_name}} from '../services/{{service_name}}';

const router = express.Router();

{{#each endpoint}}
  {{#each this.path}}
    {{#validMethod @key}}
/**
 {{#if ../summary}}
 * {{../summary}}
 *
 {{/if}}
 {{#each ../descriptionLines}}
 * {{this}}
 {{/each}}
 */
router.{{@key}}('{{../../subresource}}', (req, res, next) => {
  const options = {
    {{#each ../parameters}}
      {{#equal this.in "query"}}
    {{../name}}: req.query.{{../name}}{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "path"}}
    {{../name}}: req.params.{{../name}}{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#match @../key "(post|put)"}}
        {{#equal ../in "body"}}
    {{../name}}: req.body.{{../name}}{{#unless @last}},{{/unless}}
        {{/equal}}
      {{/match}}
    {{/each}}
  };

  {{../../../service_name}}.{{../operationId}}(options, (err, data) => {
    if (err) {
    {{#each ../responses}}
      {{#compare @key 400 operator=">="}}
      const err_response = { status: {{@key}}, message: '{{../description}}' };
      return res.status({{@key}}).send(err_response);
      {{/compare}}
      {{#equal @key "default"}}
      const err_response = { status: 200, message: '{{../description}}' };
      return res.status(500).send(err_response);
      {{/equal}}
    {{/each}}
    }

    {{#each ../responses}}
      {{#compare @key 400 operator="<"}}
    res.status({{@key}}).send(data);
      {{/compare}}
    {{/each}}
  });
});

    {{/validMethod}}
  {{/each}}
{{/each}}
module.exports = router;
