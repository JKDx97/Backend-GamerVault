const db = require('../DB/db')

const stockPc = {
     getAllStockPcs: (req, res) => {
        const query = `
                SELECT 
                    sp.*, 
                    p.nombre AS pc_modelo,
                    p.marca AS pc_marca, 
                    pr.nombre AS proveedor_nombre 
                FROM stock_pcs sp
                JOIN pcs p ON sp.pc_id = p.id
                JOIN proveedores pr ON sp.proveedor_id = pr.id
                ORDER BY sp.fecha DESC
            `;

        db.query(query, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result);
        });
    },
    addPcStock : (req,res)=>{
        const { pc_id, proveedor_id, stock_guardado } = req.body;
        db.query('INSERT INTO stock_pcs (pc_id, proveedor_id, stock_guardado) VALUES (?,?,?)' , [pc_id,proveedor_id,stock_guardado] , (err,result)=>{
            if(err) return res.status(500).json({message : 'Error en el servidor' , detail : err});

            db.query('UPDATE pcs SET stock = stock + ? WHERE id = ?' , [stock_guardado,pc_id] , (err1,result1)=>{
                if(err1) return res.status(500).json({message : 'Error en el servidor' , detail : err1});
                res.send('Stock Actualizado correctamente')
            })
        })
    }
}

module.exports = stockPc