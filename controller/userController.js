const db = require('../DB/db')
const bcrypt = require('bcryptjs')

const UserController = {
    createUser: async (req, res) => {
        const { dni, nombre, apellidoP, apellidoM, celular, email, usuario, password } = req.body;
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            db.query(
                'INSERT INTO users (dni, nombre, apellidoP, apellidoM, celular, email, usuario, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [dni, nombre, apellidoP, apellidoM, celular, email, usuario, hashedPassword],
                (err, result) => {
                    if (err) return res.status(500).json(err);
                    res.status(201).json({
                        id: result.insertId,
                        dni,
                        nombre,
                        apellidoP,
                        apellidoM,
                        celular,
                        email,
                        usuario
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Error al encriptar la contraseña' });
        }
    },

    getAllUser: (req, res) => {
        db.query(
            'SELECT id, dni, nombre, apellidoP, apellidoM, celular, email, usuario, fecha_registro, CAST(estado AS UNSIGNED) AS estado FROM users',
            (err, result) => {
                if (err) return res.status(500).json(err);
                res.status(200).json(result);
            }
        );
    },

    getEnabledUsers: (req, res) => {
        db.query('SELECT id, dni, nombre, apellidoP, apellidoM, celular, email, usuario, fecha_registro, CAST(estado AS UNSIGNED) AS estado FROM users WHERE estado = 1',
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Error en el servidor', details: err });
                res.status(200).json(results);
            });
    },

    getDesibledUsers: (req, res) => {
        db.query('SELECT id, dni, nombre, apellidoP, apellidoM, celular, email, usuario, CAST(estado AS UNSIGNED) AS estado FROM users WHERE estado = 0',
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Error en el servidor', details: err });
                res.status(200).json(results);
            });
    },

    getOneUserById: (req, res) => {
        const { dni } = req.params;
        if (!dni) {
            return res.status(400).json({ message: "DNI es requerido" });
        }
        db.query(
            'SELECT id, dni, nombre, apellidoP, apellidoM, celular, email, usuario, fecha_registro, CAST(estado AS UNSIGNED) AS estado FROM users WHERE dni = ?',
            [dni],
            (err, results) => {
                if (err) return res.status(500).json({ error: "Error en la base de datos", details: err });
                if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
                res.status(200).json(results[0]);
            }
        );
    },

    updateUserById: (req, res) => {
        const { id } = req.params;
        const { dni, nombre, apellidoP, apellidoM, celular, email, usuario } = req.body;

        const query = `
            UPDATE users 
            SET dni = COALESCE(?, dni), 
                nombre = COALESCE(?, nombre), 
                apellidoP = COALESCE(?, apellidoP), 
                apellidoM = COALESCE(?, apellidoM), 
                celular = COALESCE(?, celular), 
                email = COALESCE(?, email), 
                usuario = COALESCE(?, usuario)
                            WHERE id = ?
        `;
        const params = [dni, nombre, apellidoP, apellidoM, celular, email, usuario, id];

        db.query(query, params, (err, result) => {
            if (err) return res.status(500).json({ error: "Error en la base de datos", details: err });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });

            res.status(200).json({ message: "Usuario actualizado correctamente" });
        });
    },

    deleteUser: (req, res) => {
        const { dni } = req.params;
        db.query('DELETE FROM users WHERE dni = ?', [dni], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        });
    },

    disabledUser: (req, res) => {
        const { id } = req.params;
        db.query('UPDATE users SET estado = 0 WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en la base de datos', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json({ message: 'Usuario deshabilitado' });
        });
    },

    enabledUser: (req, res) => {
        const { id } = req.params;
        db.query('UPDATE users SET estado = 1 WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en la base de datos', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json({ message: 'Usuario habilitado' });
        });
    }
};

module.exports = UserController;
