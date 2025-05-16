const db = require('../../../DB/db')

const createUserMTable = `CREATE TABLE IF NOT EXISTS usersMarket (
id INT AUTO_INCREMENT PRIMARY KEY,
dni CHAR(9) NOT NULL UNIQUE,
nombre VARCHAR(100) NOT NULL,
apellidoP VARCHAR(100) NOT NULL,
apellidoM VARCHAR(100) NOT NULL,
celular INT(20) NOT NULL UNIQUE,
direccion TEXT NOT NULL,
nacimiento DATE NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado BINARY DEFAULT 1)`

db.query(createUserMTable , (err)=>{
    if(err){
        console.log('Error al crear la tabla', err)
        return
    }
    console.log('Tabla usuarios Market creado exitoasamente')
})

module.exports = db