const pemeriksaanService = require("../services/pemeriksaanService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await pemeriksaanService.getAll();

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const data = await pemeriksaanService.getById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

});

const store = asyncHandler(async (req, res) => {

    const data = await pemeriksaanService.create(req.body);

    res.status(201).json({
        success: true,
        message: "Pemeriksaan berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async (req, res) => {

    const data = await pemeriksaanService.update(
        req.params.id,
        req.body,
        req.user
    );

    res.status(200).json({
        success: true,
        message: "Pemeriksaan berhasil diperbarui",
        data
    });

});

const destroy = asyncHandler(async (req, res) => {

    await pemeriksaanService.remove(
        req.params.id,
        req.user
    );

    res.status(200).json({
        success: true,
        message: "Pemeriksaan berhasil dihapus"
    });

});

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};