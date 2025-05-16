const express = require('express');
const usersController = require('../../controller/market/userMarketController'); // Asegúrate de que el controlador esté en la carpeta correcta
const router = express.Router();

router.post('/users', usersController.createUser); // Crear usuario
router.get('/users', usersController.getAllUsers); // Obtener todos los usuarios
router.get('/users/:id', usersController.getUserById); // Obtener usuario por ID
router.put('/users/:id', usersController.updateUser); // Actualizar usuario
router.delete('/users/:id', usersController.deleteUser); // Eliminar usuario
router.patch('/users/:id/state', usersController.toggleUserState); // Habilitar/Deshabilitar usuario

module.exports = router;
