const fs = require('fs');
const path = require('path');
const db = require('../DB/db');
const stripe = require('stripe')(process.env.CLAVE_STRIPE);
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
});

const ventaController = {
    createPaymentIntent: async (req, res) => {
        const { total } = req.body;
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: 'pen',
                payment_method_types: ['card'],
            });
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el pago con Stripe' });
        }
    },

    createVenta: (req, res) => {
        const {
            nombre, apellido, departamento, region, distrito, direccion,
            dni, correo, telefono, total, carrito
        } = req.body;

        if (!Array.isArray(carrito) || carrito.length === 0) {
            return res.status(400).json({ error: 'Carrito vacío' });
        }

        const sqlVenta = `
        INSERT INTO ventas 
        (nombre, apellido, departamento, region, distrito, direccion, dni, correo, telefono, total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        db.query(sqlVenta, [nombre, apellido, departamento, region, distrito, direccion, dni, correo, telefono, total], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al guardar la venta' });
            }

            const ventaId = result.insertId;

            const sqlDetalle = `
            INSERT INTO detalle_ventas 
            (venta_id, producto_id, producto_tipo, cantidad, precio_unitario, subtotal) 
            VALUES ?
            `;
            const detalles = carrito.map(item => [
                ventaId,
                item.id,
                item.tipo, // <<--- este es el nuevo valor que se insertará
                item.cantidad,
                Number(item.precio),
                (item.cantidad * Number(item.precio)).toFixed(2)
            ]);

            db.query(sqlDetalle, [detalles], async (err2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ error: 'Venta creada, pero error al guardar el detalle' });
                }

                // ACTUALIZAR STOCK
                try {
                    for (const item of carrito) {
                        let tabla;
                        if (item.tipo === 'consola') tabla = 'consolas';
                        else if (item.tipo === 'laptop') tabla = 'laptops';
                        else if (item.tipo === 'pc') tabla = 'pcs';
                        else {
                            console.warn(`Tipo de producto desconocido: ${item.tipo}`);
                            continue;
                        }

                        const sqlUpdateStock = `
                        UPDATE ${tabla} 
                        SET stock = stock - ? 
                        WHERE id = ? AND stock >= ?
                    `;

                        await new Promise((resolve, reject) => {
                            db.query(sqlUpdateStock, [item.cantidad, item.id, item.cantidad], (err, result) => {
                                if (err) {
                                    console.error(`Error al actualizar stock en ${tabla} para producto ${item.id}:`, err);
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    }
                } catch (stockError) {
                    return res.status(500).json({ error: 'Error al actualizar stock de productos' });
                }

                const sqlPedido = `INSERT INTO pedidos (venta_id, estado) VALUES (?, 'pendiente')`;

                db.query(sqlPedido, [ventaId], async (err3) => {
                    if (err3) {
                        console.error(err3);
                        return res.status(500).json({ error: 'Venta y detalle guardados, pero error al guardar el pedido' });
                    }

                    // ---- GENERAR PDF Y ENVIAR CORREO (misma lógica tuya) ----
                    const pdfPath = path.join(__dirname, `../public/pdfs/venta_${ventaId}.pdf`);
                    const pdfDoc = new PDFDocument();
                    const writeStream = fs.createWriteStream(pdfPath);
                    pdfDoc.pipe(writeStream);

                    const logoPath = path.join(__dirname, '../assets/image/image.png');
                    if (fs.existsSync(logoPath)) {
                        pdfDoc.image(logoPath, { width: 100, align: 'center' }).moveDown();
                    }

                    pdfDoc.fontSize(20).text('GamerVault - Resumen de Compra', { align: 'center' }).moveDown();
                    pdfDoc.fontSize(12)
                        .text(`Cliente: ${nombre} ${apellido}`)
                        .text(`Dirección: ${direccion}, ${distrito}, ${region}, ${departamento}`)
                        .text(`DNI: ${dni}`)
                        .text(`Correo: ${correo}`)
                        .text(`Teléfono: ${telefono}`)
                        .moveDown();

                    pdfDoc.text('Detalle de productos:', { underline: true }).moveDown(0.5);
                    pdfDoc.table({
                        columnStyles: { 0: { width: 150 }, 1: { width: 70 }, 2: { width: 100 }, 3: { width: 100 } },
                        data: [
                            ['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'],
                            ...carrito.map(item => [
                                item.modelo ? `${item.marca} ${item.modelo}` : item.nombre,
                                item.cantidad.toString(),
                                `S/. ${parseFloat(item.precio).toFixed(2)}`,
                                `S/. ${(item.cantidad * parseFloat(item.precio)).toFixed(2)}`
                            ])
                        ]
                    }, { width: 500 });

                    const subtotal = carrito.reduce((acc, item) => acc + (item.cantidad * parseFloat(item.precio)), 0);
                    const impuestos = (subtotal * 0.18).toFixed(2);
                    const totalFinal = (parseFloat(subtotal) + parseFloat(impuestos)).toFixed(2);

                    pdfDoc.text(`Subtotal: S/. ${subtotal.toFixed(2)}`, { align: 'right' })
                        .text(`IGV (18%): S/. ${impuestos}`, { align: 'right' })
                        .text(`Total: S/. ${totalFinal}`, { align: 'right', bold: true })
                        .moveDown();

                    pdfDoc.text('Gracias por comprar en GamerVault. Contáctanos en gamervaultsac@gmail.com o síguenos en redes sociales.', {
                        align: 'center'
                    });

                    const imagePath = path.join(__dirname, '../assets/image/image.png');
                    pdfDoc.image(imagePath, 50, 450, { fit: [500, 300], align: 'center', valign: 'center' });
                    pdfDoc.end();

                    writeStream.on('finish', async () => {
                        try {
                            await transporter.sendMail({
                                from: `"GamerVault" <gamervaultsac@gmail.com>`,
                                to: correo,
                                subject: '🎉 ¡Gracias por tu compra en GamerVault!',
                                html: `
                                <h2>Hola ${nombre}, gracias por tu compra 🕹️</h2>
                                <p>Adjuntamos el resumen de tu compra en formato PDF.</p>
                                <p>Si tienes dudas, contáctanos en <a href="mailto:gamervaultsac@gmail.com">gamervaultsac@gmail.com</a></p>
                                <p>¡Gracias por confiar en nosotros!</p>
                            `,
                                attachments: [{
                                    filename: `resumen_compra_${ventaId}.pdf`,
                                    path: pdfPath
                                }]
                            });

                            res.status(201).json({
                                message: 'Venta, detalle, pedido y stock actualizados. Correo enviado.',
                                ventaId,
                                pdfUrl: `/pdfs/venta_${ventaId}.pdf`
                            });
                        } catch (emailError) {
                            console.error(emailError);
                            res.status(500).json({ error: 'Venta guardada, pero error al enviar correo' });
                        }
                    });
                });
            });
        });
    },

    getVentaDni: (req, res) => {
        const { dni } = req.params
        db.query('SELECT * FROM ventas WHERE dni = ?', [dni], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor', detail: err });
            res.status(200).json(result)
        })
    }
};

module.exports = ventaController;
