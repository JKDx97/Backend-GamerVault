const express = require('express')
const router = express.Router()
const {getVentaDni,createVenta , createPaymentIntent} = require('../controller/ventaController')

router.get('/:dni' , getVentaDni)
router.post('/' , createVenta)
router.post('/create-payment-intent' , createPaymentIntent)

module.exports = router