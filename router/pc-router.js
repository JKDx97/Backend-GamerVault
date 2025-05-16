const express = require('express');
const router = express.Router();
const pcsController = require('../controller/pcController');

router.post('/', pcsController.createPc);

router.get('/', pcsController.getAllPcs);

router.get('/available', pcsController.getAvailablePcs);

router.get('/:id', pcsController.getPcById);

router.put('/:id', pcsController.updatePc);

router.put('/toggle/:id', pcsController.togglePcState);

router.delete('/:id', pcsController.deletePc);



module.exports = router;
