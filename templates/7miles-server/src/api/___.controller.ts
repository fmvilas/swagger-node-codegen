import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";
import { Mapper } from "../helpers/mapper";
import { I{{capitalize operation_name}}Controller } from './interfaces/{{lowercase operation_name}}.interface.ts';
// TODO import { CarModel } from "../model/car";


@injectable()
class {{capitalize operation_name}}Controller extends HapiController {

  /**
   * Here we are also injecting the car service to manage interactions with the database
   * in addition to the logger and mapper.  You can inject as many dependencies as you need.
   *
   * This is a test.
   */
  constructor(
      @inject(TYPES.Logger) private logger: Logger,
      @inject(TYPES.Mapper) private mapper: Mapper)
  {
      super();
      this.logger.info('Created controller {{capitalize operation_name}}Controller');
  }

{{#each headOperation}}
  {{#each this.path}}
    {{#validMethod @key}}

/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
 public async {{@key}}{{../operationId}}(request: Request, toolkit: ResponseToolkit);
 /*
  const options = {
  {{#if ../requestBody}}
  body: req.body{{#compare (lookup ../parameters 'length') 0 operator = '>' }},{{/compare}}
  {{/if}}
    {{#each ../parameters}}
      {{#equal this.in "query"}}
        {{{quote ../name}}}: req.query['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "path"}}
        {{{quote ../name}}}: req.params['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "header"}}
        {{{quote ../name}}}: req.header['{{../name}}']{{#unless @last}},{{/unless}}
      {{/equal}}
    {{/each}}
    };

    try {
      const result = await {{camelCase ../../../operation_name}}.{{../operationId}}(options);
      {{#ifNoSuccessResponses ../responses}}
        res.header('X-Result', result.data).status(200).send();
      {{else}}
        res.status(result.status || 200).send(result.data);
      {{/ifNoSuccessResponses}}
      } catch (err) {
      {{#ifNoErrorResponses ../responses}}
        return res.status(500).send({
          status: 500,
          error: 'Server Error'
        });
      {{else}}
      next(err);
      {{/ifNoErrorResponses}}
      }
      */
    }
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
  @HapiController({
    method: '{{allcaps @key}}',
    path: '{{../../subresource}}',
    options: {
      validate: { },
      description: '{{ ../summary }}',
      tags: [/* TODO */],
      auth: false
    }
  })
  public async {{../operationId}}(request: Request, toolkit: ResponseToolkit)
   return toolkit.response().code(501);
  }

    {{/validMethod}}
  {{/each}}
{{/each}}
}

export { {{capitalize operation_name}}Controller }
