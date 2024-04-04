const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const checkAuth = require("../middleware/checkAuth");
const refreshToken = require('../middleware/refreshToken');

router.patch('/buyReservation', refreshToken, checkAuth, controller.buyReservation);
router.get('/findReservation', refreshToken, checkAuth, controller.findReservation);

module.exports = router;