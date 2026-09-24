const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", verifyToken, authorize("Admin"), userController.index);

router.get("/:id", verifyToken, authorize("Admin"), userController.show);

router.post("/", verifyToken, authorize("Admin"), userController.store);

router.put("/:id", verifyToken, authorize("Admin"), userController.update);

router.put("/:id/password", verifyToken, authorize("Admin"), userController.changePassword);

router.delete("/:id", verifyToken, authorize("Admin"), userController.destroy);

module.exports = router;