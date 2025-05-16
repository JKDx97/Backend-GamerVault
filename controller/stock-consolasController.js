const db = require('../DB/db')

const stockConsola = {

    getAllStockConsolas: (req, res) => {
        const query = `
                SELECT 
                    sc.*, 
                    c.nombre AS consola_nombre, 
                    p.nombre AS proveedor_nombre 
                FROM stock_consolas sc
                JOIN consolas c ON sc.consola_id = c.id
                JOIN proveedores p ON sc.proveedor_id = p.id
                ORDER BY sc.fecha DESC
            `;

        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    },


    addStockConsolas: (req, res) => {
        const { consola_id, proveedor_id, stock_guardado } = req.body;
        db.query('INSERT INTO stock_consolas (consola_id, proveedor_id, stock_guardado) VALUES (?,?,?)', [consola_id, proveedor_id, stock_guardado], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });

            db.query('UPDATE consolas SET stock = stock + ? WHERE id = ?', [stock_guardado, consola_id], (err1, result1) => {
                if (err1) return res.status(500).json({ message: 'Error en el servidor', detail: err1 });
                res.send('Stock Actualizado correctamente')
            })
        })
    }
}

module.exports = stockConsola