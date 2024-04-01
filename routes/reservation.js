const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const checkAuth = require("../middleware/checkAuth");


router.patch('/buyReservation', checkAuth, controller.buyReservation);
router.get('/findReservation', checkAuth, controller.findReservation);

module.exports = router;