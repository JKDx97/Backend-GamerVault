const bcrypt = require('bcryptjs');
const db = require('../DB/db');

const loginController = {
    login: (socket) => {
        socket.on('login', async ({ usuario, password }) => {
            try {
                db.query('SELECT * FROM users WHERE usuario = ?', [usuario], async (err, results) => {
                    if (err) {
                        console.error('Error al buscar usuario:', err);
                        return socket.emit('login_error', { msg: 'Error en el servidor' });
                    }

                    if (results.length === 0) {
                        return socket.emit('login_error', { msg: 'Credenciales inválidas' });
                    }

                    const user = results[0];
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (!isMatch) {
                        return socket.emit('login_error', { msg: 'Credenciales inválidas' });
                    }

                    // Emitir solo si las credenciales son correctas
                    socket.emit('login_success', {
                        msg: 'Inicio de sesión exitoso',
                        user: {
                            id: user.id,
                            dni: user.dni,
                            nombre: user.nombre,
                            apellidoP: user.apellidoP,
                            apellidoM: user.apellidoM,
                            celular: user.celular,
                            email: user.email,
                            usuario: user.usuario,
                            fecha_registro: user.fecha_registro,
                            estado: user.estado
                        }
                    });
                });
            } catch (error) {
                console.error('Error en el proceso de login:', error);
                socket.emit('login_error', { msg: 'Error en el servidor', details: error.message });
            }
        });
    }
}

module.exports = loginController