const express = require("express");
const router = express.Router();
const { uploadMiddleware, uploadImage, getImagesByLaptopId, deleteImage } = require("../controller/imagen-laptopController");

router.post("/upload", uploadMiddleware, uploadImage);
router.get("/:laptop_id", getImagesByLaptopId);
router.delete("/:id", deleteImage);

module.exports = router;
