const db = require('../DB/db')

const stockLaptop = {
    getAllStockLaptops: (req, res) => {
        const query = `
                SELECT 
                    sl.*, 
                    l.modelo AS laptop_modelo,
                    l.marca AS laptop_marca, 
                    p.nombre AS proveedor_nombre 
                FROM stock_laptops sl
                JOIN laptops l ON sl.laptop_id = l.id
                JOIN proveedores p ON sl.proveedor_id = p.id
                ORDER BY sl.fecha DESC
            `;

        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    },

    addStockLaptop: (req, res) => {
        const { laptop_id, proveedor_id, stock_guardado } = req.body;
        db.query('INSERT INTO stock_laptops (laptop_id, proveedor_id, stock_guardado) VALUES (?,?,?)', [laptop_id, proveedor_id, stock_guardado], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });

            db.query('UPDATE laptops SET stock = stock + ? WHERE id = ?', [stock_guardado, laptop_id], (err1, result1) => {
                if (err1) return res.status(500).json({ message: 'Error en el servidor', detail: err1 });
                res.send('Stock Actualizado correctamente')
            })
        })
    }
}

module.exports = stockLaptop