const kategoriModel = require("../models/kategoriModel");
const AppError = require("../utils/AppError");

const getAll = async () => {

    return await kategoriModel.getAll();

};

const getById = async (id) => {

    const kategori = await kategoriModel.getById(id);

    if (!kategori) {
        throw new AppError("Kategori tidak ditemukan", 404);
    }

    return kategori;

};

const create = async (data) => {

    const cekNama = await kategoriModel.getByNama(data.nama_kategori);

    if (cekNama) {
        throw new AppError("Kategori sudah ada", 400);
    }

    const id = await kategoriModel.create(data);

    return await kategoriModel.getById(id);

};

const update = async (id, data) => {

    await getById(id);

    const cekNama = await kategoriModel.getByNama(data.nama_kategori);

    if (cekNama && cekNama.id != id) {
        throw new AppError("Kategori sudah ada", 400);
    }

    return await kategoriModel.update(id, data);

};

const remove = async (id) => {

    await getById(id);

    await kategoriModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};