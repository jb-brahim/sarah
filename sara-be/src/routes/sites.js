const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { auth, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { siteCreate } = require('../validators/site');

router.get('/', siteController.getAll);
router.get('/stream', siteController.stream);
router.get('/:id', siteController.getOne);
router.post('/', [auth, admin, validate(siteCreate)], siteController.create);
router.put('/:id', [auth, admin], siteController.update);
router.delete('/:id', [auth, admin], siteController.delete);

module.exports = router;