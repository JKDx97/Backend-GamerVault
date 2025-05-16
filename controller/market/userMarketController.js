const db = require('../../DB/db');

const usersMarketController = {
    createUser: (req, res) => {
        const { dni, nombre, apellidoP, apellidoM, celular, direccion, nacimiento, email, password, estado = 1 } = req.body;
        
        db.query(
            'INSERT INTO usersMarket (dni, nombre, apellidoP, apellidoM, celular, direccion, nacimiento, email, password, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [dni, nombre, apellidoP, apellidoM, celular, direccion, nacimiento, email, password, estado],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                res.status(201).json({ message: 'Usuario creado exitosamente', id: results.insertId });
            }
        );
    },

    getAllUsers: (req, res) => {
        db.query('SELECT * FROM usersMarket', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    getUserById: (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM usersMarket WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json(results[0]);
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const { dni, nombre, apellidoP, apellidoM, celular, direccion, nacimiento, email, password, estado } = req.body;
        
        db.query(
            `UPDATE usersMarket 
            SET dni = COALESCE(?, dni), nombre = COALESCE(?, nombre), apellidoP = COALESCE(?, apellidoP), 
                apellidoM = COALESCE(?, apellidoM), celular = COALESCE(?, celular), direccion = COALESCE(?, direccion), 
                nacimiento = COALESCE(?, nacimiento), email = COALESCE(?, email), password = COALESCE(?, password), estado = COALESCE(?, estado) 
            WHERE id = ?`,
            [dni, nombre, apellidoP, apellidoM, celular, direccion, nacimiento, email, password, estado, id],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
                res.status(200).json({ message: 'Usuario actualizado' });
            }
        );
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM usersMarket WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        });
    },

    toggleUserState: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        
        db.query('UPDATE usersMarket SET estado = ? WHERE id = ?', [estado, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.status(200).json({ message: `Usuario ${estado ? 'habilitado' : 'deshabilitado'}`, estado });
        });
    }
};

module.exports = usersMarketController;
