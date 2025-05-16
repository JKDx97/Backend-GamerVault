const db = require('../../DB/db')

const createLaptopsTable = `CREATE TABLE IF NOT EXISTS  laptops (
id INT AUTO_INCREMENT PRIMARY KEY,
id_laptop VARCHAR(255) NOT NULL UNIQUE,
modelo VARCHAR(255) NOT NULL,
precio DECIMAL(10,2) NOT NULL,
procesador VARCHAR(255) NOT NULL,
pantalla VARCHAR(255) NOT NULL,
marca VARCHAR(255) NOT NULL, 
ram INT NOT NULL,
almacenamiento INT NOT NULL,
tipo_disco ENUM('HDD', 'SSD', 'NVMe') NOT NULL,
resolucion VARCHAR(255) NOT NULL,
gpu VARCHAR(100) NOT NULL,
bateria INT NOT NULL,
puertos TEXT NOT NULL,
sistema_operativo VARCHAR(50) NOT NULL,
stock INT DEFAULT 0,
fecha_lanzamiento DATE NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado BINARY DEFAULT 1
) `


db.query(createLaptopsTable , (err)=>{
    if(err){
        console.log('Error al crear la tabla', err)
        return
    }
    console.log('Tabla laptops creado exitoasamente')
})