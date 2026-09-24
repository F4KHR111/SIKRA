const itemModel = require("../models/itemModel");
const kategoriModel = require("../models/kategoriModel");
const AppError = require("../utils/AppError");

const getAll = async () => {

    return await itemModel.getAll();

};

const getById = async (id) => {

    const item = await itemModel.getById(id);

    if (!item) {
        throw new AppError("Item pemeriksaan tidak ditemukan", 404);
    }

    return item;

};

const getByKategori = async (kategoriId) => {

    const kategori = await kategoriModel.getById(kategoriId);

    if (!kategori) {
        throw new AppError("Kategori tidak ditemukan", 404);
    }

    return await itemModel.getByKategori(kategoriId);

};

const create = async (data) => {

    const kategori = await kategoriModel.getById(data.kategori_id);

    if (!kategori) {
        throw new AppError("Kategori tidak ditemukan", 404);
    }

    const cekItem = await itemModel.getByNama(
        data.kategori_id,
        data.nama_item
    );

    if (cekItem) {
        throw new AppError(
            "Item pemeriksaan sudah ada pada kategori tersebut",
            400
        );
    }

    const id = await itemModel.create(data);

    return await itemModel.getById(id);

};

const update = async (id, data) => {

    await getById(id);

    const kategori = await kategoriModel.getById(data.kategori_id);

    if (!kategori) {
        throw new AppError("Kategori tidak ditemukan", 404);
    }

    const cekItem = await itemModel.getByNama(
        data.kategori_id,
        data.nama_item
    );

    if (cekItem && cekItem.id != id) {
        throw new AppError(
            "Item pemeriksaan sudah ada pada kategori tersebut",
            400
        );
    }

    return await itemModel.update(id, data);

};

const remove = async (id) => {

    await getById(id);

    await itemModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    getByKategori,
    create,
    update,
    remove
};