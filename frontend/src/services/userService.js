import api from "./api";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const getAll = async () => {

    const response = await api.get(
        "/users",
        config()
    );

    return response.data.data;

};

const getById = async (id) => {

    const response = await api.get(
        `/users/${id}`,
        config()
    );

    return response.data.data;

};

const create = async (data) => {

    const response = await api.post(
        "/users",
        data,
        config()
    );

    return response.data;

};

const update = async (id, data) => {

    const response = await api.put(
        `/users/${id}`,
        data,
        config()
    );

    return response.data;

};

const changePassword = async (id, password) => {

    const response = await api.put(
        `/users/${id}/password`,
        { password },
        config()
    );

    return response.data;

};

const remove = async (id) => {

    const response = await api.delete(
        `/users/${id}`,
        config()
    );

    return response.data;

};

export default {

    getAll,

    getById,

    create,

    update,

    changePassword,

    remove

};
