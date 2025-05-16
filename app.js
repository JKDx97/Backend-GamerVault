const express = require('express');
const db = require('./DB/db');
const cors = require('cors');
const http = require('http');  
const socketIo = require('socket.io'); 

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, { cors: { origin: '*' } }); 

app.use(cors());
app.use(express.json());

const userrouter = require('./router/users-router');
app.use('/user', userrouter);

const laptopRouter = require('./router/lapotps-router');
app.use('/laptop', laptopRouter);

const imagenLaptop = require('./router/images-laptos-router');
app.use('/laptops_image', imagenLaptop);

const cansolaRouter = require('./router/console-router')
app.use('/consola' , cansolaRouter)

const imagenConsola = require('./router/images-consola-router')
app.use('/consolas_image' , imagenConsola)

const pc = require('./router/pc-router')
app.use('/pcs' , pc)

const pcImagen = require('./router/images-pc-router')
app.use('/pc_imagen' , pcImagen)

const venta = require('./router/venta-router')
app.use('/venta' , venta)

const proveedor = require('./router/proveedor-router')
app.use('/proveedor' , proveedor)

const stockconsola = require('./router/stock-console-router')
app.use('/stock-consolas' , stockconsola)

const stocklaptop = require('./router/stock-laptop-router')
app.use('/stock-laptop' , stocklaptop)

const stockPc = require('./router/stock-pc-router')
app.use('/stock-pc' , stockPc)

const pedidos = require('./router/pedidos-router')
app.use('/pedidos' , pedidos)

const detalle = require('./router/detalle-venta-router')
app.use('/detalle' , detalle)

db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos establecida correctamente');
    }
});

const userMarket = require('./router/market/user-market-router')
app.use('/userMarket' , userMarket)

const loginHandler = require('./controller/loginController');
io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado con sockets');

    loginHandler.login(socket);

    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor conectado en el puerto 3000');
});
