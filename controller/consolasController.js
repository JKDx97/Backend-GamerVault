const db = require('../DB/db');

const consolasController = {
    createConsola: (req, res) => {
        let {
            marca,
            nombre,
            precio,
            anio_lanzamiento,
            modelo,
            cantidad_puertos_usb,
            capacidad_almacenamiento,
            color,
            conectividad,
            tipo_consola,
            cantidad_controles,
            memoria_ram,
            stock = 0,
            estado = 1
        } = req.body;
        const cleanMarca = marca.replace(/\s+/g, '').toUpperCase()
        const cleanModelo = nombre.replace(/\s+/g, '').toUpperCase(); // Eliminar espacios y poner en mayúsculas
        const id_consola = `${cleanMarca}_${cleanModelo}_${Date.now()}`
        db.query('INSERT INTO consolas (id_consola, marca, nombre, precio, anio_lanzamiento, modelo, cantidad_puertos_usb, capacidad_almacenamiento, color, conectividad, tipo_consola, cantidad_controles, memoria_ram, stock, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_consola, marca, nombre, precio, anio_lanzamiento, modelo, cantidad_puertos_usb, capacidad_almacenamiento, color, conectividad, tipo_consola, cantidad_controles, memoria_ram, stock, estado],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                res.status(201).json({ message: 'Consola creada exitosamente', id: results.insertId });
            });
    },

    getAllConsolas: (req, res) => {
        db.query('SELECT *, CAST(estado AS UNSIGNED) AS estado FROM consolas', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    getAvailableConsolas: (req, res) => {
        db.query('SELECT * FROM consolas WHERE estado = 1', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    updateConsola: (req, res) => {
        const { id } = req.params;
        const {
            nombre,
            precio,
            anio_lanzamiento,
            modelo,
            cantidad_puertos_usb,
            capacidad_almacenamiento,
            color,
            conectividad,
            tipo_consola,
            cantidad_controles,
            memoria_ram,
            stock
        } = req.body;

        const query = `
            UPDATE consolas 
            SET nombre = COALESCE(?, nombre),
                precio = COALESCE(?, precio),
                anio_lanzamiento = COALESCE(?, anio_lanzamiento),
                modelo = COALESCE(?, modelo),
                cantidad_puertos_usb = COALESCE(?, cantidad_puertos_usb),
                capacidad_almacenamiento = COALESCE(?, capacidad_almacenamiento),
                color = COALESCE(?, color),
                conectividad = COALESCE(?, conectividad),
                tipo_consola = COALESCE(?, tipo_consola),
                cantidad_controles = COALESCE(?, cantidad_controles),
                memoria_ram = COALESCE(?, memoria_ram),
                stock = COALESCE(?, stock)
            WHERE id = ?
        `;
        db.query(query, [nombre, precio, anio_lanzamiento, modelo, cantidad_puertos_usb, capacidad_almacenamiento, color, conectividad, tipo_consola, cantidad_controles, memoria_ram, stock, id],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                if (results.affectedRows === 0) return res.status(404).json({ message: 'Consola no encontrada' });
                res.status(200).json({ message: 'Consola actualizada exitosamente' });
            });
    },

    deleteConsola: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM consolas WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Consola no encontrada' });
            res.status(200).json({ message: 'Consola eliminada exitosamente' });
        });
    },

    toggleConsolaState: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        db.query('UPDATE consolas SET estado = ? WHERE id = ?', [estado, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Consola no encontrada' });
            res.status(200).json({ message: `Consola ${estado ? 'habilitada' : 'deshabilitada'}`, estado });
        });
    },

    getConsolaById: (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM consolas WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.length === 0) return res.status(404).json({ message: 'Consola no encontrada' });
            res.status(200).json(results[0]);
        });
    }
};

module.exports = consolasController;
