const express = require('express')
const consolasController = require('../controller/consolasController')
const router = express.Router()

router.get('/' , consolasController.getAllConsolas)
router.get('/available' , consolasController.getAvailableConsolas)
router.get('/:id' , consolasController.getConsolaById)
router.post('/' , consolasController.createConsola)
router.put('/:id' , consolasController.updateConsola)
router.put('/toggle/:id' , consolasController.toggleConsolaState)
router.delete('/:id' , consolasController.deleteConsola)
module.exports = router