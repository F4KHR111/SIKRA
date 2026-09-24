import api from "./api";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const configMultipart = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data"
    }
});

const getAll = async () => {

    const response = await api.get(
        "/kendaraan",
        config()
    );

    return response.data.data;

};

const getById = async (id) => {

    const response = await api.get(
        `/kendaraan/${id}`,
        config()
    );

    return response.data.data;

};

const create = async (formData) => {

    const response = await api.post(
        "/kendaraan",
        formData,
        configMultipart()
    );

    return response.data;

};

const update = async (id, formData) => {

    const response = await api.put(
        `/kendaraan/${id}`,
        formData,
        configMultipart()
    );

    return response.data;

};

const remove = async (id) => {

    const response = await api.delete(
        `/kendaraan/${id}`,
        config()
    );

    return response.data;

};

export default {

    getAll,

    getById,

    create,

    update,

    remove

};