const express = require('express')
const UserController = require('../controller/userController')
const router = express.Router()

router.post('/' , UserController.createUser)
router.get('/' , UserController.getAllUser)
router.get('/:dni' , UserController.getOneUserById)
router.put('/:id' , UserController.updateUserById)
router.delete('/:dni', UserController.deleteUser)
router.put('/disable/:id' , UserController.disabledUser)
router.put('/enabled/:id' , UserController.enabledUser)
router.get('/enabled/users' , UserController.getEnabledUsers)
router.get('/disabled/users' , UserController.getDesibledUsers)
module.exports = router