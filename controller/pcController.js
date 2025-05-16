const db = require('../DB/db');

const pcsController = {
    createPc: (req, res) => {
        const { nombre, marca, procesador, ram, almacenamiento, gpu, sistema_operativo, precio, stock = 0, fecha_ingreso, estado = 1 } = req.body;
        const cleanMarca = marca.replace(/\s+/g, '').toUpperCase()
        const cleanModelo = nombre.replace(/\s+/g, '').toUpperCase();
        const id_pc = `${cleanMarca}_${cleanModelo}_${Date.now()}`
        db.query(
            'INSERT INTO PCS (id_pc, nombre, marca, procesador, ram, almacenamiento, gpu, sistema_operativo, precio, stock, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_pc, nombre, marca, procesador, ram, almacenamiento, gpu, sistema_operativo, precio, stock, fecha_ingreso, estado],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                res.status(201).json({ message: 'PC creada exitosamente', id: results.insertId });
            }
        );
    },

    getAllPcs: (req, res) => {
        db.query('SELECT *, CAST(estado AS UNSIGNED) AS estado FROM pcs', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    getAvailablePcs: (req, res) => {
        db.query('SELECT * FROM PCS WHERE estado = 1', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    updatePc: (req, res) => {
        const { id } = req.params;
        const { nombre, marca, procesador, ram, almacenamiento, gpu, sistema_operativo, precio, stock, fecha_ingreso } = req.body;
        
        const query = `
            UPDATE PCS SET 
                nombre = COALESCE(?, nombre),
                marca = COALESCE(?, marca),
                procesador = COALESCE(?, procesador),
                ram = COALESCE(?, ram),
                almacenamiento = COALESCE(?, almacenamiento),
                gpu = COALESCE(?, gpu),
                sistema_operativo = COALESCE(?, sistema_operativo),
                precio = COALESCE(?, precio),
                stock = COALESCE(?, stock),
                fecha_ingreso = COALESCE(?, fecha_ingreso)
            WHERE id = ?
        `;
        
        db.query(query, [nombre, marca, procesador, ram, almacenamiento, gpu, sistema_operativo, precio, stock, fecha_ingreso, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'PC no encontrada' });
            res.status(200).json({ message: 'PC actualizada exitosamente' });
        });
    },

    deletePc: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM PCS WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'PC no encontrada' });
            res.status(200).json({ message: 'PC eliminada correctamente' });
        });
    },

    togglePcState: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        db.query('UPDATE PCS SET estado = ? WHERE id = ?', [estado, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'PC no encontrada' });
            res.status(200).json({ message: `PC ${estado ? 'habilitada' : 'deshabilitada'}`, estado });
        });
    },

    getPcById: (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM PCS WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.length === 0) return res.status(404).json({ message: 'PC no encontrada' });
            res.status(200).json(results[0]);
        });
    }
};

module.exports = pcsController;
