const express = require("express");
const { uploadMiddleware, uploadImage, getImagesByConsolaId, deleteImage } = require("../controller/imagen-consolaController");
const router = express.Router();

router.get("/:consola_id", getImagesByConsolaId);
router.post("/upload", uploadMiddleware, uploadImage); // 🛠 Usar el middleware correcto
router.delete("/:id", deleteImage);

module.exports = router;
