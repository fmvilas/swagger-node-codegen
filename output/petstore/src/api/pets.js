const express = require('express');
const pets = require('../services/pets');

const router = new express.Router();


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

module.exports = router;
