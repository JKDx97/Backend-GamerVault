const db = require('../DB/db')

const proveedoresController = {

    createProveedor: (req, res) => {
        const { nombre, ruc, telefono, email, direccion, contacto } = req.body
        db.query('INSERT INTO proveedores (nombre,ruc,telefono,email,direccion,contacto) VALUES (?,?,?,?,?,?)', [nombre, ruc, telefono, email, direccion, contacto], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(201).json({ message: 'Proveedor Creado con exito' })
        })
    },

    getAllProvedor: (req, res) => {
        db.query('SELECT * FROM proveedores', (err, result) => {
            if (err) return res.status(500).json({ message: 'Erorr en el servidor', detail: err });
            res.status(200).json(result)
        })
    },

    getAvailableProveedor: (req, res) => {
        db.query('SELECT * FROM proveedores WHERE estado = 1', (err, result) => {
            if (err) return res.status(500).json({ message: 'Erorr en el servidor', detail: err });
            res.status(200).json(result)
        })
    },

    getProveedorById: (req, res) => {
        const { id } = req.params
        db.query('SELECT * FROM proveedores WHERE id = ?', [id], (err, resut) => {
            if (err) return res.status(500).json({ message: 'Erorr en el servidor', detail: err });
            res.status(200).json(result)
        })
    },

    updateProveedor: (req, res) => {
        const { id } = req.params
        const { nombre, ruc, telefono, email, direccion, contacto } = req.body
        const query = `
            UPDATE proveedores SET 
                nombre = COALESCE(?, nombre),
                ruc = COALESCE(?, ruc),
                telefono = COALESCE(?, telefono),
                email = COALESCE(?, email),
                direccion = COALESCE(?, direccion),
                contacto = COALESCE(?, contacto)
            WHERE id = ?
        `;
        db.query(query, [nombre, ruc, telefono, email, direccion, contacto, id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(201).json({ message: 'Proveedor Actualizado correctamente' })
        })
    },

    deleteProveedor: (req, res) => {
        const { id } = req.params
        db.query('DELETE FROM proveedores WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(201).json({ message: 'Proveedor eliminado correctamente' })
        })
    },

    toggleProveedorState: (req, res) => {
        const { id } = req.params
        const { estado } = req.body
        db.query('UPDATE proveedores SET estado = ? WHERE id = ?', [estado, id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json({ message: `PROVEEDOR ${estado ? 'habilitada' : 'deshabilitada'}`, estado });

        })
    }
}


module.exports = proveedoresController