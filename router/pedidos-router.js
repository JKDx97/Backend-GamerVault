const express = require('express')
const router = express.Router()
const {getPedidos} = require('../controller/pedidosController')

router.get('/' , getPedidos)

module.exports = router
