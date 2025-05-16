const express = require('express')
const router = express.Router()
const {getAllProvedor,getProveedorById,getAvailableProveedor,createProveedor,updateProveedor,deleteProveedor,toggleProveedorState} = require('../controller/proveedorController')

router.get('/' , getAllProvedor)
router.get('/aviable' , getAvailableProveedor)
router.get('/:id' , getProveedorById)
router.post('/' , createProveedor)
router.put('/:id' , updateProveedor)
router.put('/toggle/:id' , toggleProveedorState)
router.delete('/:id' ,  deleteProveedor)

module.exports = router