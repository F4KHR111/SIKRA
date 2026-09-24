const itemService = require("../services/itemService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await itemService.getAll();

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const data = await itemService.getById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

});

const getByKategori = asyncHandler(async (req, res) => {

    const data = await itemService.getByKategori(req.params.kategoriId);

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const store = asyncHandler(async (req, res) => {

    const data = await itemService.create(req.body);

    res.status(201).json({
        success: true,
        message: "Item pemeriksaan berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async (req, res) => {

    const data = await itemService.update(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Item pemeriksaan berhasil diupdate",
        data
    });

});

const destroy = asyncHandler(async (req, res) => {

    await itemService.remove(req.params.id);

    res.status(200).json({
        success: true,
        message: "Item pemeriksaan berhasil dihapus"
    });

});

module.exports = {
    index,
    show,
    getByKategori,
    store,
    update,
    destroy
};