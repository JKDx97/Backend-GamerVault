const db = require('../DB/db');

const laptopsController = {
    createLaptop: (req, res) => {
        let {
            modelo, precio, procesador, pantalla, marca, ram, almacenamiento,
            tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo,
            stock = 0, fecha_lanzamiento, estado = 1
        } = req.body;

        const cleanMarca = marca.replace(/\s+/g, '').toUpperCase();
        const cleanModelo = modelo.replace(/\s+/g, '').toUpperCase();
        const id = `${cleanMarca}_${cleanModelo}_${Date.now()}`;

        db.query(
            'INSERT INTO laptops (id_laptop, modelo, precio, procesador, pantalla, marca, ram, almacenamiento, tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo, stock, fecha_lanzamiento, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, modelo, precio, procesador, pantalla, marca, ram, almacenamiento, tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo, stock, fecha_lanzamiento, estado],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
                res.status(201).json({ message: 'Laptop creada exitosamente', id });
            }
        );
    },

    getAllLaptops: (req, res) => {
        db.query(`
            SELECT id, id_laptop, modelo, precio, procesador, pantalla, marca, ram, almacenamiento,
                   tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo, stock,
                   fecha_lanzamiento, fecha_registro, CAST(estado AS UNSIGNED) AS estado
            FROM laptops
        `, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    getAllAvailableLaptops: (req, res) => {
        db.query(`
            SELECT id, id_laptop, modelo, precio, procesador, pantalla, marca, ram, almacenamiento,
                   tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo, stock,
                   fecha_lanzamiento, fecha_registro, CAST(estado AS UNSIGNED) AS estado
            FROM laptops WHERE estado = 1
        `, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            res.status(200).json(results);
        });
    },

    updateLaptops: (req, res) => {
        const { id } = req.params;
        const {
            modelo, precio, procesador, pantalla, marca, ram, almacenamiento,
            tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo,
            stock, fecha_lanzamiento
        } = req.body;

        const query = `
            UPDATE laptops 
            SET modelo = COALESCE(?, modelo),
                precio = COALESCE(?, precio),
                procesador = COALESCE(?, procesador),
                pantalla = COALESCE(?, pantalla),
                marca = COALESCE(?, marca),
                ram = COALESCE(?, ram),
                almacenamiento = COALESCE(?, almacenamiento),
                tipo_disco = COALESCE(?, tipo_disco),
                resolucion = COALESCE(?, resolucion),
                gpu = COALESCE(?, gpu),
                bateria = COALESCE(?, bateria),
                puertos = COALESCE(?, puertos),
                sistema_operativo = COALESCE(?, sistema_operativo),
                stock = COALESCE(?, stock),
                fecha_lanzamiento = COALESCE(?, fecha_lanzamiento)
            WHERE id = ?
        `;
        db.query(query, [modelo, precio, procesador, pantalla, marca, ram, almacenamiento, tipo_disco, resolucion, gpu, bateria, puertos, sistema_operativo, stock, fecha_lanzamiento, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Laptop no encontrada' });
            res.status(201).json({ message: 'Laptop actualizada' });
        });
    },

    deleteLaptop: (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM laptops WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Laptop no encontrada' });
            res.status(201).json({ message: 'Laptop eliminada correctamente' });
        });
    },

    toggleLaptopState: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;

        db.query('UPDATE laptops SET estado = ? WHERE id = ?', [estado, id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Laptop no encontrada' });

            res.status(200).json({ message: `Laptop ${estado ? 'habilitada' : 'deshabilitada'}`, estado });
        });
    },

    getLaptopById: (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM laptops WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', details: err });
            if (results.length === 0) return res.status(404).json({ message: 'Laptop no encontrada' });
            res.status(200).json(results);
        });
    }
};

module.exports = laptopsController;
