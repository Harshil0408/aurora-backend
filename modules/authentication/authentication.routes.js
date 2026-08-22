const router = require('express').Router();
const { userLoginController } = require('./authentication.controller');

router.post('/login', userLoginController);

module.exports = router;
