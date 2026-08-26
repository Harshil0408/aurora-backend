const router = require('express').Router();
const { userLoginController, registerUserController, registerSellerUserController, sellerLoginController } = require('./authentication.controller');

router.post('/login', userLoginController);
router.post('/seller/login', sellerLoginController);
router.post('/register', registerUserController);
router.post('/seller/register', registerSellerUserController);

module.exports = router;
