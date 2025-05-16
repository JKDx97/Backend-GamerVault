const db = require('../../DB/db');

const createLaptopImagesTable = `CREATE TABLE IF NOT EXISTS images_pcs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pc_id VARCHAR(255),
    pc_image_url VARCHAR(255),
    pc_image_principal VARCHAR(255),
    FOREIGN KEY (pc_id) REFERENCES pcs(id_pc) ON DELETE CASCADE
)`;

db.query(createLaptopImagesTable, (err) => {
    if (err) { 
        console.log('Error al crear la tabla:', err);
        return;
    }
    console.log('Tabla images_pcs creada exitosamente');
});
        