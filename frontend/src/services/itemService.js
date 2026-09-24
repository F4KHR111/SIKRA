import api from "./api";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const getAll = async () => {
    const response = await api.get("/item", config());
    return response.data.data;
};

const getById = async (id) => {
    const response = await api.get(`/item/${id}`, config());
    return response.data.data;
};

const getByKategori = async (kategoriId) => {
    const response = await api.get(`/item/kategori/${kategoriId}`, config());
    return response.data.data;
};

const create = async (data) => {
    const response = await api.post("/item", data, config());
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/item/${id}`, data, config());
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/item/${id}`, config());
    return response.data;
};

export default {
    getAll,
    getById,
    getByKategori,
    create,
    update,
    remove
};
