const expres = require('express')
const router = expres.Router()
const {getAllStockConsolas,addStockConsolas} = require('../controller/stock-consolasController')

router.get('/' , getAllStockConsolas)
router.post('/' , addStockConsolas)

module.exports = router