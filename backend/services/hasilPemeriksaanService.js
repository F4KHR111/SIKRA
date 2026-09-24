const hasilPemeriksaanModel = require("../models/hasilPemeriksaanModel");

const pemeriksaanModel = require("../models/pemeriksaanModel");
const itemModel = require("../models/itemModel");
const statusModel = require("../models/statusModel");

const AppError = require("../utils/AppError");

const getAll = async () => {

    return await hasilPemeriksaanModel.getAll();

};

const getById = async (id) => {

    const hasil = await hasilPemeriksaanModel.getById(id);

    if (!hasil) {
        throw new AppError("Data hasil pemeriksaan tidak ditemukan", 404);
    }

    return hasil;

};

const create = async (data) => {

    const pemeriksaan = await pemeriksaanModel.getById(data.pemeriksaan_id);

    if (!pemeriksaan) {
        throw new AppError("Data pemeriksaan tidak ditemukan", 404);
    }

    const item = await itemModel.getById(data.item_id);

    if (!item) {
        throw new AppError("Item pemeriksaan tidak ditemukan", 404);
    }

    const status = await statusModel.getById(data.status_id);

    if (!status) {
        throw new AppError("Status pemeriksaan tidak ditemukan", 404);
    }

    const id = await hasilPemeriksaanModel.create(data);

    return await hasilPemeriksaanModel.getById(id);

};

const update = async (id, data) => {

    const hasil = await hasilPemeriksaanModel.getById(id);

    if (!hasil) {
        throw new AppError("Data hasil pemeriksaan tidak ditemukan", 404);
    }

    const pemeriksaan = await pemeriksaanModel.getById(data.pemeriksaan_id);

    if (!pemeriksaan) {
        throw new AppError("Data pemeriksaan tidak ditemukan", 404);
    }

    const item = await itemModel.getById(data.item_id);

    if (!item) {
        throw new AppError("Item pemeriksaan tidak ditemukan", 404);
    }

    const status = await statusModel.getById(data.status_id);

    if (!status) {
        throw new AppError("Status pemeriksaan tidak ditemukan", 404);
    }

    await hasilPemeriksaanModel.update(id, data);

    return await hasilPemeriksaanModel.getById(id);

};

const remove = async (id) => {

    const hasil = await hasilPemeriksaanModel.getById(id);

    if (!hasil) {
        throw new AppError("Data hasil pemeriksaan tidak ditemukan", 404);
    }

    await hasilPemeriksaanModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};