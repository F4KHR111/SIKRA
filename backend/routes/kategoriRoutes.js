const express = require("express");

const router = express.Router();

const kategoriController = require("../controllers/kategoriController");

const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, kategoriController.index);

router.get("/:id", verifyToken, kategoriController.show);

router.post("/", verifyToken, kategoriController.store);

router.put("/:id", verifyToken, kategoriController.update);

router.delete("/:id", verifyToken, kategoriController.destroy);

module.exports = router;