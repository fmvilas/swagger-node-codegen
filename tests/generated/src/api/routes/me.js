import express from 'express';
import me from '../services/me';

const router = express.Router();

/**
 * User Profile
 *
 * The User Profile endpoint returns information about the Uber 
 * user that has authorized with the application.
 */
router.get('/', (req, res, next) => {
  const options = {
  };

  me.getMe(options, (err, data) => {
    if (err) {
      const err_response = { status: 500, message: 'Unexpected error' };
      return res.status(500).send(err_response);
    }

    res.send(data);
  });
});

module.exports = router;
