import api from "./api";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const getAll = async () => {
    const response = await api.get("/hasil-pemeriksaan", config());
    return response.data.data;
};

const getById = async (id) => {
    const response = await api.get(`/hasil-pemeriksaan/${id}`, config());
    return response.data.data;
};

const create = async (data) => {
    const response = await api.post("/hasil-pemeriksaan", data, config());
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/hasil-pemeriksaan/${id}`, data, config());
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/hasil-pemeriksaan/${id}`, config());
    return response.data;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
