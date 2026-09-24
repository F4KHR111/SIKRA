const pemeriksaanModel = require("../models/pemeriksaanModel");
const kendaraanModel = require("../models/kendaraanModel");
const userModel = require("../models/userModel");

const AppError = require("../utils/AppError");

const getAll = async () => {

    return await pemeriksaanModel.getAll();

};

const getById = async (id) => {

    const pemeriksaan = await pemeriksaanModel.getById(id);

    if (!pemeriksaan) {
        throw new AppError("Data pemeriksaan tidak ditemukan", 404);
    }

    return pemeriksaan;

};

const create = async (data) => {

    const kendaraan = await kendaraanModel.getById(data.kendaraan_id);

    if (!kendaraan) {
        throw new AppError("Kendaraan tidak ditemukan", 404);
    }

    const inspektor = await userModel.getById(data.inspektor_id);

    if (!inspektor) {
        throw new AppError("Inspektor tidak ditemukan", 404);
    }

    const id = await pemeriksaanModel.create(data);

    return await pemeriksaanModel.getById(id);

};

const update = async (id, data, user) => {

    const pemeriksaan = await pemeriksaanModel.getById(id);

    if (!pemeriksaan) {
        throw new AppError("Data pemeriksaan tidak ditemukan", 404);
    }

    // Admin boleh edit semua
    if (
        user.role !== "Admin" &&
        pemeriksaan.inspektor_id !== user.id
    ) {
        throw new AppError(
            "Anda tidak memiliki hak untuk mengubah pemeriksaan ini",
            403
        );
    }

    const kendaraan = await kendaraanModel.getById(data.kendaraan_id);

    if (!kendaraan) {
        throw new AppError("Kendaraan tidak ditemukan", 404);
    }

    const inspektor = await userModel.getById(data.inspektor_id);

    if (!inspektor) {
        throw new AppError("Inspektor tidak ditemukan", 404);
    }

    await pemeriksaanModel.update(id, data);

    return await pemeriksaanModel.getById(id);

};

const remove = async (id, user) => {

    const pemeriksaan = await pemeriksaanModel.getById(id);

    if (!pemeriksaan) {
        throw new AppError("Data pemeriksaan tidak ditemukan", 404);
    }

    if (
        user.role !== "Admin" &&
        pemeriksaan.inspektor_id !== user.id
    ) {
        throw new AppError(
            "Anda tidak memiliki hak untuk menghapus pemeriksaan ini",
            403
        );
    }

    await pemeriksaanModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};