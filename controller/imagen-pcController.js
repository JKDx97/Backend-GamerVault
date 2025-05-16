const multer = require("multer");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const db = require("../DB/db");
require("dotenv").config();

// 🔹 Configurar el cliente de S3 con AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 🔹 Filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten imágenes"), false);
  }
  cb(null, true);
};

// 🔹 Configurar Multer para S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const fileName = `images/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  fileFilter, // ✅ Aplicamos el filtro aquí
});


exports.uploadMiddleware = upload.single("image");

// 📌 Subir imagen a AWS S3 y guardar en MySQL
exports.uploadImage = async (req, res) => {
  try {
    const { pc_id } = req.body;

    if (!pc_id || !req.file) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    console.log("📥 Archivo recibido:", req.file);
    const imageUrl = req.file.location;
    console.log("✅ Imagen subida a AWS S3:", imageUrl);

    // 🔹 Guardar en la base de datos
    db.query(
      "INSERT INTO images_pcs (pc_id, pc_image_url, pc_image_principal) VALUES (?, ?, ?)",
      [pc_id, imageUrl, "NO"], // Aquí se guarda la URL
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true, message: "Imagen subida correctamente a AWS S3", id: result.insertId, url: imageUrl });
      }
    );
  } catch (error) {
    console.error("🚨 Error en la subida:", error);
    res.status(500).json({ error: error.message });
  }
};


// 📌 Obtener imágenes por laptop_id
// 📌 Obtener imágenes por pc_id
exports.getImagesByPcId = (req, res) => {
  const { pc_id } = req.params; // Usa pc_id en lugar de laptop_id
  db.query(
    "SELECT * FROM images_pcs WHERE pc_id = ?",
    [pc_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};


// 📌 Eliminar imagen de AWS S3 y MySQL
exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT pc_image_url FROM images_pcs WHERE id = ?",
    [id],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      const imageUrl = results[0].laptop_image_url;
      
      try {
        const fileName = imageUrl.split(`${process.env.AWS_BUCKET_NAME}/`)[1]; // ✅ Extraer clave correctamente

        if (!fileName) {
          return res.status(400).json({ error: "No se pudo extraer la clave del archivo." });
        }

        console.log("🗑 Eliminando imagen de S3:", fileName);

        // 📌 Eliminar imagen de AWS S3
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
        }));

        console.log("✅ Imagen eliminada de AWS S3");

        // 📌 Eliminar de MySQL
        db.query("DELETE FROM images_pcs WHERE id = ?", [id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Imagen eliminada correctamente" });
        });

      } catch (error) {
        console.error("🚨 Error al eliminar imagen:", error);
        res.status(500).json({ error: "Error al eliminar imagen de S3" });
      }
    }
  );
};
