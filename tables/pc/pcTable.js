const db = require('../../DB/db')

const createPcTable = `CREATE TABLE IF NOT EXISTS PCS (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    id_pc VARCHAR(255) UNIQUE,
    nombre VARCHAR(100) NOT NULL,       
    marca VARCHAR(50) NOT NULL,         
    procesador VARCHAR(100) NOT NULL,   
    ram VARCHAR(50) NOT NULL,           
    almacenamiento VARCHAR(100) NOT NULL, 
    gpu VARCHAR(100),                   
    sistema_operativo VARCHAR(50) NOT NULL, 
    precio DECIMAL(10,2) NOT NULL,      
    stock INT NOT NULL DEFAULT 0,       
    fecha_ingreso DATE NOT NULL,        
    estado BINARY DEFAULT 1
)`

db.query(createPcTable , (err)=>{
    if(err){
        console.log('Error al crear la tabla', err)
        return
    }
    console.log('Tabla PC creado exitoasamente')
})

module.exports = db