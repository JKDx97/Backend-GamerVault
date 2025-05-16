const db = require('../../DB/db')

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni CHAR(9) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidoP VARCHAR(100) NOT NULL,
    apellidoM VARCHAR(100) NOT NULL,
    celular INT(20) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BINARY DEFAULT 1,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
)
`

db.query(createUserTable , (err)=>{
    if(err){
        console.log('Error al crear la tabla', err)
        return
    }
    console.log('Tabla usuarios creado exitoasamente')
})

module.exports = db