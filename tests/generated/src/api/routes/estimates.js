import express from 'express';
import estimates from '../services/estimates';

const router = express.Router();

/**
 * Price Estimates
 *
 * The Price Estimates endpoint returns an estimated price 
 * range for each product offered at a given location. The 
 * price estimate is provided as a formatted string with the 
 * full price range and the localized currency 
 * symbol.&lt;br&gt;&lt;br&gt;The response also includes low and high 
 * estimates, and the [ISO 
 * 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code 
 * for situations requiring currency conversion. When surge is 
 * active for a particular product, its surge_multiplier will 
 * be greater than 1, but the price estimate already factors in 
 * this multiplier.
 */
router.get('/price', (req, res, next) => {
  const options = {
    start_latitude: req.query.start_latitude,
    start_longitude: req.query.start_longitude,
    end_latitude: req.query.end_latitude,
    end_longitude: req.query.end_longitude
  };

  estimates.getEstimatesPrice(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

/**
 * Time Estimates
 *
 * The Time Estimates endpoint returns ETAs for all products 
 * offered at a given location, with the responses expressed as 
 * integers in seconds. We recommend that this endpoint be 
 * called every minute to provide the most accurate, up-to-date 
 * ETAs.
 */
router.get('/time', (req, res, next) => {
  const options = {
    start_latitude: req.query.start_latitude,
    start_longitude: req.query.start_longitude,
    customer_uuid: req.query.customer_uuid,
    product_id: req.query.product_id
  };

  estimates.getEstimatesTime(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

module.exports = router;
