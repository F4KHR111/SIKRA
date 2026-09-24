const express = require("express");

const router = express.Router();

const pemeriksaanController = require("../controllers/pemeriksaanController");

const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Semua user yang login boleh melihat daftar pemeriksaan
router.get(
    "/",
    verifyToken,
    pemeriksaanController.index
);

// Semua user yang login boleh melihat detail pemeriksaan
router.get(
    "/:id",
    verifyToken,
    pemeriksaanController.show
);

// Admin & Inspektor boleh membuat pemeriksaan
router.post(
    "/",
    verifyToken,
    authorize("Admin", "Inspektor"),
    pemeriksaanController.store
);

// Admin & Inspektor boleh request update
// Kepemilikan data akan dicek di Service
router.put(
    "/:id",
    verifyToken,
    authorize("Admin", "Inspektor"),
    pemeriksaanController.update
);

// Admin & Inspektor boleh request delete
// Kepemilikan data juga akan dicek di Service
router.delete(
    "/:id",
    verifyToken,
    authorize("Admin", "Inspektor"),
    pemeriksaanController.destroy
);

module.exports = router;