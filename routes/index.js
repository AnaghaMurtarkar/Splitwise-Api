const express = require('express'),
  router = express.Router();

const rootPrefix = "..",
  RegisterUser = require(rootPrefix + '/app/services/Register');

router.post('/register', async function(req, res) {

  const first_name = req.body.first_name,
    last_name = req.body.last_name,
    user_name = req.body.user_name,
    email = req.body.email,
    password = req.body.password;

  const serviceResponse = await new RegisterUser({
    first_name: first_name,
    last_name: last_name,
    user_name: user_name,
    email: email,
    password: password
  }).perform().then(function(resp) {
    return resp;
  });

  console.log('serviceResponse  ========', serviceResponse);
  return Promise.resolve(serviceResponse);
});

module.exports = router;
