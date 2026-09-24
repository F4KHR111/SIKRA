const express = require("express");

const router = express.Router();

const roleController = require("../controllers/roleController");

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware"); // <- WAJIB

router.get("/", verifyToken, authorize("Admin"), roleController.index);

router.get("/:id", verifyToken, authorize("Admin"), roleController.show);

router.post("/", verifyToken, authorize("Admin"), roleController.store);

router.put("/:id", verifyToken, authorize("Admin"), roleController.update);

router.delete("/:id", verifyToken, authorize("Admin"), roleController.destroy);

module.exports = router;