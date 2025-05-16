const express = require("express");
const { uploadMiddleware, uploadImage, getImagesByPcId, deleteImage } = require("../controller/imagen-pcController");
const router = express.Router();

router.get("/:pc_id", getImagesByPcId);
router.post("/upload", uploadMiddleware, uploadImage); 
router.delete("/:id", deleteImage);

module.exports = router;
