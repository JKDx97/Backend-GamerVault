const express = require('express')
const router = express.Router()
const {getProductosMasVendidos,getDetalleVenta} = require('../controller/detalle-ventaController')

router.get('/top' , getProductosMasVendidos)
router.get('/:venta_id' , getDetalleVenta )

module.exports = router