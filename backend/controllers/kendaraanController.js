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

    if (req.file && req.file.buffer) {
        const mime = req.file.mimetype || "image/jpeg";
        req.body.foto = `data:${mime};base64,${req.file.buffer.toString("base64")}`;
    } else if (req.file && req.file.filename) {
        req.body.foto = "/uploads/" + req.file.filename;
    } else if (!req.body.foto) {
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

    if (req.file && req.file.buffer) {
        const mime = req.file.mimetype || "image/jpeg";
        req.body.foto = `data:${mime};base64,${req.file.buffer.toString("base64")}`;

        // Hapus file lama dari disk jika dulu disimpan sebagai file lokal
        if (oldKendaraan && oldKendaraan.foto && oldKendaraan.foto.startsWith("/uploads/")) {
            try {
                const oldFilePath = path.join(__dirname, "../", oldKendaraan.foto);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            } catch (err) {
                console.error("Gagal menghapus file lama:", err.message);
            }
        }
    } else if (req.file && req.file.filename) {
        req.body.foto = "/uploads/" + req.file.filename;

        // Hapus file lama dari disk
        if (oldKendaraan && oldKendaraan.foto && oldKendaraan.foto.startsWith("/uploads/")) {
            try {
                const oldFilePath = path.join(__dirname, "../", oldKendaraan.foto);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            } catch (err) {
                console.error("Gagal menghapus file lama:", err.message);
            }
        }
    } else {
        // Jika tidak upload file baru, pertahankan foto lama
        req.body.foto = (oldKendaraan && oldKendaraan.foto) || "";
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
    if (oldKendaraan && oldKendaraan.foto && oldKendaraan.foto.startsWith("/uploads/")) {
        try {
            const filePath = path.join(__dirname, "../", oldKendaraan.foto);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error("Gagal menghapus file saat hapus kendaraan:", err.message);
        }
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