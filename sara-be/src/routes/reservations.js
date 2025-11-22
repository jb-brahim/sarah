const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reservationCreate } = require('../validators/reservation');

router.get('/', auth, reservationController.getAll);
router.get('/:id', auth, reservationController.getOne);
router.post('/', [auth, validate(reservationCreate)], reservationController.create);
router.put('/:id/cancel', auth, reservationController.cancel);

module.exports = router;