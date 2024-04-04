const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const checkAuth = require("../middleware/checkAuth");
const refreshToken = require('../middleware/refreshToken');

router.post('/createUser', controller.createUser);
router.get('/getUser', refreshToken, checkAuth, controller.getUser);
router.get('/loginUser', controller.loginUser)
router.delete('/removeUser', refreshToken, checkAuth, controller.removeUser);
router.patch('/updateUser', refreshToken, checkAuth, controller.updateUser);
router.delete('/logout', refreshToken, checkAuth, controller.logOut);

module.exports = router;