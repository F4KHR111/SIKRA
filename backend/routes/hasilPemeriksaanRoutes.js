const express = require("express");

const router = express.Router();

const hasilPemeriksaanController = require("../controllers/hasilPemeriksaanController");

const verifyToken = require("../middleware/authMiddleware");

router.get(
    "/",
    verifyToken,
    hasilPemeriksaanController.index
);

router.get(
    "/:id",
    verifyToken,
    hasilPemeriksaanController.show
);

router.post(
    "/",
    verifyToken,
    hasilPemeriksaanController.store
);

router.put(
    "/:id",
    verifyToken,
    hasilPemeriksaanController.update
);

router.delete(
    "/:id",
    verifyToken,
    hasilPemeriksaanController.destroy
);

module.exports = router;