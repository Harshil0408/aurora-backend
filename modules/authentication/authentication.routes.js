const router = require('express').Router();
const { userLoginController, registerUserController } = require('./authentication.controller');
const { cryptoMiddleware } = require('../../middleware/cryptoMiddleware');

router.post('/login', userLoginController);
router.post('/register', registerUserController);

module.exports = router;
