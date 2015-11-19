import express from 'express';
import products from '../services/products';

const router = express.Router();

/**
 * Product Types
 *
 * The Products endpoint returns information about the Uber 
 * products offered at a given location. The response includes 
 * the display name and other details about each product, and 
 * lists the products in the proper display order.
 */
router.get('/', (req, res, next) => {
  const options = {
    latitude: req.query.latitude,
    longitude: req.query.longitude
  };

  products.getProducts(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

/**
 * Product Types
 *
 * The Products endpoint returns information about the Uber 
 * products offered at a given location. The response includes 
 * the display name and other details about each product, and 
 * lists the products in the proper display order.
 */
router.get('/:id', (req, res, next) => {
  const options = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
    id: req.params.id
  };

  products.getProductsById(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

module.exports = router;
