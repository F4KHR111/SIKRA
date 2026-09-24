const statusModel = require("../models/statusModel");
const AppError = require("../utils/AppError");

const getAll = async () => {

    return await statusModel.getAll();

};

const getById = async (id) => {

    const status = await statusModel.getById(id);

    if (!status) {
        throw new AppError("Status pemeriksaan tidak ditemukan", 404);
    }

    return status;

};

module.exports = {
    getAll,
    getById
};