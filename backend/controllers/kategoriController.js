const kategoriService = require("../services/kategoriService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await kategoriService.getAll();

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const data = await kategoriService.getById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

});

const store = asyncHandler(async (req, res) => {

    const data = await kategoriService.create(req.body);

    res.status(201).json({
        success: true,
        message: "Kategori berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async (req, res) => {

    const data = await kategoriService.update(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Kategori berhasil diupdate",
        data
    });

});

const destroy = asyncHandler(async (req, res) => {

    await kategoriService.remove(req.params.id);

    res.status(200).json({
        success: true,
        message: "Kategori berhasil dihapus"
    });

});

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};