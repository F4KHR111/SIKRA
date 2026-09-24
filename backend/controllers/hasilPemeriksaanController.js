const hasilPemeriksaanService = require("../services/hasilPemeriksaanService");

const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await hasilPemeriksaanService.getAll();

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const data = await hasilPemeriksaanService.getById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

});

const store = asyncHandler(async (req, res) => {

    const data = await hasilPemeriksaanService.create(req.body);

    res.status(201).json({
        success: true,
        message: "Hasil pemeriksaan berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async (req, res) => {

    const data = await hasilPemeriksaanService.update(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Hasil pemeriksaan berhasil diperbarui",
        data
    });

});

const destroy = asyncHandler(async (req, res) => {

    await hasilPemeriksaanService.remove(req.params.id);

    res.status(200).json({
        success: true,
        message: "Hasil pemeriksaan berhasil dihapus"
    });

});

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};