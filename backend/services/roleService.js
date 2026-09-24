const roleModel = require("../models/roleModel");
const AppError = require("../utils/AppError");

const getAll = async () => {

    return await roleModel.getAll();

};

const getById = async (id) => {

    const role = await roleModel.getById(id);

    if (!role) {
        throw new AppError("Role tidak ditemukan",404);
    }

    return role;

};

const create = async (data) => {

    const id = await roleModel.create(data.nama_role);

    return await roleModel.getById(id);

};

const update = async (id,data) => {

    await getById(id);

    return await roleModel.update(id,data.nama_role);

};

const remove = async (id) => {

    await getById(id);

    await roleModel.remove(id);

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};