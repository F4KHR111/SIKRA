const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const kendaraanController = require("../controllers/kendaraanController");

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan!"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
});

router.get("/", verifyToken, authorize("Admin","Inspektor","Pimpinan"), kendaraanController.index);

router.get("/:id", verifyToken, authorize("Admin","Inspektor","Pimpinan"), kendaraanController.show);

router.post("/", verifyToken, authorize("Admin"), upload.single("foto"), kendaraanController.store);

router.put("/:id", verifyToken, authorize("Admin"), upload.single("foto"), kendaraanController.update);

router.delete("/:id", verifyToken, authorize("Admin"), kendaraanController.destroy);

module.exports = router;