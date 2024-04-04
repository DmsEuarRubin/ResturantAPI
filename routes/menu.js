const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');
const checkAuth = require("../middleware/checkAuth");
const refreshToken = require('../middleware/refreshToken');

router.get('/getMenu/:id', refreshToken, checkAuth, controller.getInfo);
router.patch('/addRate', refreshToken, checkAuth, controller.addRate);
router.post('/orderFood', refreshToken, checkAuth, controller.orderFoods);
router.patch('/orderRate', refreshToken, checkAuth, controller.orderRate);
router.get('/orderList', refreshToken, checkAuth, controller.getOrder);
router.patch('/orderDelivred', refreshToken, checkAuth, controller.orderDelivred);

module.exports = router;