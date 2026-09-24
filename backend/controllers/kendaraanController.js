const kendaraanService = require("../services/kendaraanService");
const asyncHandler = require("../middleware/asyncHandler");
const fs = require("fs");
const path = require("path");

const index = asyncHandler(async (req, res) => {

    const data = await kendaraanService.getAll();

    res.status(200).json({
        success: true,
        message: "Data kendaraan berhasil diambil",
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const kendaraan = await kendaraanService.getById(req.params.id);

    res.status(200).json({
        success: true,
        message: "Detail kendaraan berhasil diambil",
        data: kendaraan
    });

});

const store = asyncHandler(async (req, res) => {

    if (req.file) {
        req.body.foto = "/uploads/" + req.file.filename;
    } else {
        req.body.foto = "";
    }

    const kendaraan = await kendaraanService.create(req.body);

    res.status(201).json({
        success: true,
        message: "Data kendaraan berhasil ditambahkan",
        data: kendaraan
    });

});

const update = asyncHandler(async (req, res) => {

    const oldKendaraan = await kendaraanService.getById(req.params.id);

    if (req.file) {
        req.body.foto = "/uploads/" + req.file.filename;

        // Hapus file lama dari disk
        if (oldKendaraan.foto && oldKendaraan.foto.startsWith("/uploads/")) {
            const oldFilePath = path.join(__dirname, "../", oldKendaraan.foto);
            fs.unlink(oldFilePath, (err) => {
                if (err) console.error("Gagal menghapus file lama:", err.message);
            });
        }
    } else {
        // Jika tidak upload file baru, pertahankan foto lama
        req.body.foto = oldKendaraan.foto || "";
    }

    const kendaraan = await kendaraanService.update(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Data kendaraan berhasil diupdate",
        data: kendaraan
    });

});

const destroy = asyncHandler(async (req, res) => {

    const oldKendaraan = await kendaraanService.getById(req.params.id);
    await kendaraanService.remove(req.params.id);

    // Hapus file foto dari disk jika ada
    if (oldKendaraan.foto && oldKendaraan.foto.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "../", oldKendaraan.foto);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Gagal menghapus file saat hapus kendaraan:", err.message);
        });
    }

    res.status(200).json({
        success: true,
        message: "Data kendaraan berhasil dihapus"
    });

});

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};