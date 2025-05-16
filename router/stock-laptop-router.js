const express = require('express')
const router = express.Router()
const {getAllStockLaptops,addStockLaptop} = require('../controller/stock-laptopsController')

router.get('/', getAllStockLaptops)
router.post('/' , addStockLaptop)

module.exports = router