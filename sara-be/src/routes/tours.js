const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { auth, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { tourCreate } = require('../validators/tour');

router.get('/', tourController.getAll);
router.get('/:id', tourController.getOne);
router.post('/', [auth, admin, validate(tourCreate)], tourController.create);
router.put('/:id', [auth, admin], tourController.update);
router.delete('/:id', [auth, admin], tourController.delete);

module.exports = router;