const kendaraanModel = require("../models/kendaraanModel");
const AppError = require("../utils/AppError");

const getAll = async () => {

    return await kendaraanModel.getAll();

};

const getById = async (id) => {

    const kendaraan = await kendaraanModel.getById(id);

    if (!kendaraan) {
        throw new AppError("Data kendaraan tidak ditemukan", 404);
    }

    return kendaraan;

};

const create = async (data) => {

    const cekPlat = await kendaraanModel.getByPlatMerah(data.plat_merah);

    if (cekPlat) {
        throw new AppError("Plat merah sudah terdaftar", 400);
    }

    const id = await kendaraanModel.create(data);

    return await kendaraanModel.getById(id);

};

const update = async (id, data) => {

    const kendaraan = await kendaraanModel.getById(id);

    if (!kendaraan) {
        throw new AppError("Data kendaraan tidak ditemukan", 404);
    }

    return await kendaraanModel.update(id, data);

};

const remove = async (id) => {

    const kendaraan = await kendaraanModel.getById(id);

    if (!kendaraan) {
        throw new AppError("Data kendaraan tidak ditemukan", 404);
    }

    await kendaraanModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};