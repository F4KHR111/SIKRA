const express = require("express");

const router = express.Router();

const statusController = require("../controllers/statusController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, statusController.index);

router.get("/:id", verifyToken, statusController.show);

module.exports = router;