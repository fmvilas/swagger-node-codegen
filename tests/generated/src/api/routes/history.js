import express from 'express';
import history from '../services/history';

const router = express.Router();

/**
 * User Activity
 *
 * The User Activity endpoint returns data about a user&#x27;s 
 * lifetime activity with Uber. The response will include 
 * pickup locations and times, dropoff locations and times, the 
 * distance of past requests, and information about which 
 * products were requested.&lt;br&gt;&lt;br&gt;The history array in the 
 * response will have a maximum length based on the limit 
 * parameter. The response value count may exceed limit, 
 * therefore subsequent API requests may be necessary.
 */
router.get('/', (req, res, next) => {
  const options = {
    offset: req.query.offset,
    limit: req.query.limit
  };

  history.getHistory(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

module.exports = router;
