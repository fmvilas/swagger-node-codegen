import express from 'express';
import {{service_name}} from '../services/{{service_name}}';

const router = express.Router();

{{#each endpoint}}
  {{#each this.path}}
/**
 * {{this.summary}}
 *
 {{#each this.descriptionLines}}
 * {{this}}
 {{/each}}
 */
router.{{@key}}('{{../subresource}}', (req, res, next) => {
  const options = {
    {{#each this.parameters}}
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

  {{../../service_name}}.{{this.operationId}}(options, (err, data) => {
    if (err) {
    {{#each this.responses}}
      {{#compare @key 400 operator=">="}}
      const err_response = { status: {{@key}}, message: '{{this.description}}' };
      return res.status({{@key}}).send(err_response);
      {{/compare}}
      {{#equal @key "default"}}
      const err_response = { status: 500, message: '{{../description}}' };
      return res.status(500).send(err_response);
      {{/equal}}
    {{/each}}
    }

    res.send(data);
  });
});

  {{/each}}
{{/each}}
module.exports = router;
