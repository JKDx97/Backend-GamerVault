const db = require('../DB/db');

const pedidosController = {
    getPedidos: (req, res) => {
        const query = `
            SELECT 
                pedidos.*, 
                ventas.id AS venta_id,
                ventas.nombre,
                ventas.apellido,
                ventas.departamento,
                ventas.region,
                ventas.distrito,
                ventas.direccion,
                ventas.dni,
                ventas.correo,
                ventas.telefono,
                ventas.total,
                ventas.fecha
            FROM pedidos
            JOIN ventas ON pedidos.venta_id = ventas.id
        `;
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    }
};

module.exports = pedidosController;
