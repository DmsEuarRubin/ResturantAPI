const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const checkAuth = require("../middleware/checkAuth");

router.post('/createUser', controller.createUser);
router.get('/getUser', checkAuth, controller.getUser);
router.get('/loginUser', controller.loginUser)
router.delete('/removeUser', checkAuth, controller.removeUser);
router.patch('/updateUser', checkAuth, controller.updateUser);

module.exports = router;