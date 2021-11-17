import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";
import { CarModel } from "../model/car";
import { Mapper } from "../helpers/mapper";
// TODO:  import { Car } from "../entity/car";

@injectable()
class PetsController extends HapiController {

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
      this.logger.info('Created controller PetsController');
  }


/**
 * List all pets
 */
router.get('/', async (req, res, next) => {
  const options = {
    limit: req.query['limit']
  };

  try {
    const result = await pets.listPets(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create a pet
 */
router.post('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await pets.createPets(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Info for a specific pet
 */
router.get('/:petId', async (req, res, next) => {
  const options = {
    petId: req.params['petId']
  };

  try {
    const result = await pets.showPetById(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

}

export { PetsController }
