const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
    "/",
    verifyToken,
    authorize("Admin", "Inspektor", "Pimpinan"),
    dashboardController.index
);

module.exports = router;