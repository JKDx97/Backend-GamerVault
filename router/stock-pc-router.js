const express = require('express')
const router = express.Router()
const {getAllStockPcs,addPcStock} = require('../controller/stock-pcController')


router.get('/', getAllStockPcs)
router.post('/' , addPcStock)

module.exports = router