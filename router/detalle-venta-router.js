const express = require('express')
const router = express.Router()
const {getDetalleVenta} = require('../controller/detalle-ventaController')

router.get('/:venta_id' , getDetalleVenta )

module.exports = router