const db = require('../../DB/db');

const createLaptopImagesTable = `CREATE TABLE IF NOT EXISTS images_laptops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    laptop_id VARCHAR(255),
    laptop_image_url VARCHAR(255),
    laptop_image_principal VARCHAR(255),
    FOREIGN KEY (laptop_id) REFERENCES laptops(id_laptop) ON DELETE CASCADE
)`;

db.query(createLaptopImagesTable, (err) => {
    if (err) { 
        console.log('Error al crear la tabla:', err);
        return;
    }
    console.log('Tabla images_laptops creada exitosamente');
});
        