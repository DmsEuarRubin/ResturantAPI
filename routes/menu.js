const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');
const checkAuth = require("../middleware/checkAuth");

router.get('/getMenu/:id', checkAuth, controller.getInfo);
router.patch('/addRate', checkAuth, controller.addRate);
router.post('/orderFood', checkAuth, controller.orderFoods);
router.patch('/orderRate', checkAuth, controller.orderRate);
router.get('/orderList', checkAuth, controller.getOrder);
router.patch('/orderDelivred', checkAuth, controller.orderDelivred);

module.exports = router;