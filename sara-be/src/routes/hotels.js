const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { auth, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { hotelCreate } = require('../validators/hotel');

router.get('/', hotelController.getAll);
router.get('/:id', hotelController.getOne);
router.get('/:id/rooms', hotelController.getRooms);
router.post('/', [auth, admin, validate(hotelCreate)], hotelController.create);
router.put('/:id', [auth, admin], hotelController.update);
router.delete('/:id', [auth, admin], hotelController.delete);

module.exports = router;