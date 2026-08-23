const router = require('express').Router();
const { userLoginController, registerUserController } = require('./authentication.controller');

router.post('/login', userLoginController);
router.post('/register', registerUserController);

module.exports = router;
