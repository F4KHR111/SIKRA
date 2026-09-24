const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");

const AppError = require("../utils/AppError");

const getAll = async () => {

    return await userModel.getAll();

};

const getById = async (id) => {

    const user = await userModel.getById(id);

    if (!user) {
        throw new AppError("User tidak ditemukan",404);
    }

    return user;

};

const create = async (data) => {

    const email = await userModel.getByEmail(data.email);

    if (email) {
        throw new AppError("Email sudah digunakan",400);
    }

    const role = await roleModel.getById(data.role_id);

    if (!role) {
        throw new AppError("Role tidak ditemukan",404);
    }

    data.password = await bcrypt.hash(data.password,10);

    const id = await userModel.create(data);

    return await userModel.getById(id);

};

const update = async (id, data) => {

    await getById(id);

    const role = await roleModel.getById(data.role_id);

    if (!role) {
        throw new AppError("Role tidak ditemukan",404);
    }

    const email = await userModel.getByEmail(data.email);

    if (email && email.id != id) {
        throw new AppError("Email sudah digunakan",400);
    }

    return await userModel.update(id,data);

};

const changePassword = async (id,password)=>{

    await getById(id);

    const hash = await bcrypt.hash(password,10);

    await userModel.updatePassword(id,hash);

};

const remove = async(id)=>{

    await getById(id);

    await userModel.remove(id);

};



module.exports = {
    getAll,
    getById,
    create,
    update,
    changePassword,
    remove
};