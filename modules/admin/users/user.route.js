const router = require('express').Router();

const { getUserForAdminController } = require('./user.controller');

router.post('/admin/users', getUserForAdminController);

module.exports = router;
