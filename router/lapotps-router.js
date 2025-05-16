const express = require('express');
const laptopsController = require('../controller/laptopsController');
const router = express.Router();

router.get('/available', laptopsController.getAllAvailableLaptops);
router.post('/', laptopsController.createLaptop);
router.get('/', laptopsController.getAllLaptops);
router.put('/:id', laptopsController.updateLaptops);
router.get('/:id', laptopsController.getLaptopById);
router.put('/toggle/:id', laptopsController.toggleLaptopState);
router.delete('/:id', laptopsController.deleteLaptop);

module.exports = router;
