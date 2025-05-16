const db = require('../DB/db');

const detalleVenta = {
    getDetalleVenta: (req, res) => {
        const { venta_id } = req.params;

        const sql = `
      SELECT 
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        CONCAT(l.marca, ' ', l.modelo) AS producto,
        'laptop' AS tipo
      FROM detalle_ventas dv
      JOIN laptops l ON dv.producto_id = l.id
      WHERE dv.venta_id = ? AND dv.producto_tipo = 'laptop'

      UNION

      SELECT 
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        CONCAT(c.marca, ' ', c.nombre) AS producto,
        'consola' AS tipo
      FROM detalle_ventas dv
      JOIN consolas c ON dv.producto_id = c.id
      WHERE dv.venta_id = ? AND dv.producto_tipo = 'consola'

      UNION

      SELECT 
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        CONCAT(p.marca, ' ', p.nombre) AS producto,
        'pc' AS tipo
      FROM detalle_ventas dv
      JOIN pcs p ON dv.producto_id = p.id
      WHERE dv.venta_id = ? AND dv.producto_tipo = 'pc'
    `;

        db.query(sql, [venta_id, venta_id, venta_id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    },
    getProductosMasVendidos: (req, res) => {
        const sql = `SELECT 
            producto,
            SUM(cantidad) AS total_vendidos
            FROM (
            SELECT 
                dv.cantidad,
                CONCAT(l.marca, ' ', l.modelo) AS producto
            FROM detalle_ventas dv
            JOIN laptops l ON dv.producto_id = l.id
            WHERE dv.producto_tipo = 'laptop'

            UNION ALL

            SELECT 
                dv.cantidad,
                CONCAT(c.marca, ' ', c.nombre) AS producto
            FROM detalle_ventas dv
            JOIN consolas c ON dv.producto_id = c.id
            WHERE dv.producto_tipo = 'consola'

            UNION ALL

            SELECT 
                dv.cantidad,
                CONCAT(p.marca, ' ', p.nombre) AS producto
            FROM detalle_ventas dv
            JOIN pcs p ON dv.producto_id = p.id
            WHERE dv.producto_tipo = 'pc'
            ) AS todos
            GROUP BY producto
            ORDER BY total_vendidos DESC
            LIMIT 10;
            `;

        db.query(sql, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    }

};


module.exports = detalleVenta;
