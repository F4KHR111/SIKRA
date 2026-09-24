const express = require("express");

const router = express.Router();

const itemController = require("../controllers/itemController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, itemController.index);

router.get("/kategori/:kategoriId", verifyToken, itemController.getByKategori);

router.get("/:id", verifyToken, itemController.show);

router.post("/", verifyToken, itemController.store);

router.put("/:id", verifyToken, itemController.update);

router.delete("/:id", verifyToken, itemController.destroy);

module.exports = router;