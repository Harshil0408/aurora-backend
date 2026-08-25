const router = require('express').Router();
const { userLoginController, registerUserController, registerSellerUserController } = require('./authentication.controller');

router.post('/login', userLoginController);
router.post('/register', registerUserController);
router.post('/seller/register', registerSellerUserController);

module.exports = router;
