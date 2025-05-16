const db = require('../../DB/db');

const createConsolasTable = `CREATE TABLE IF NOT EXISTS consolas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_consola VARCHAR(255) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    anio_lanzamiento YEAR NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cantidad_puertos_usb INT NOT NULL,
    capacidad_almacenamiento VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    conectividad VARCHAR(50) NOT NULL,
    tipo_consola VARCHAR(50) NOT NULL,
    cantidad_controles INT NOT NULL,
    memoria_ram VARCHAR(50) NOT NULL,
    stock INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BINARY DEFAULT 1
)`;

db.query(createConsolasTable, (err) => {
    if (err) {
        console.log('Error al crear la tabla', err);
        return;
    }
    console.log('Tabla consolas creada exitosamente');
});