const db = require('../../DB/db');

const createLaptopImagesTable = `CREATE TABLE IF NOT EXISTS images_consolas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consola_id VARCHAR(255),
    consola_image_url VARCHAR(255),
    consola_image_principal VARCHAR(255),
    FOREIGN KEY (consola_id) REFERENCES consolas(id_consola) ON DELETE CASCADE
)`;

db.query(createLaptopImagesTable, (err) => {
    if (err) { 
        console.log('Error al crear la tabla:', err);
        return;
    }
    console.log('Tabla images_laptops creada exitosamente');
});
        