import api from "./api";

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const getAll = async () => {
    const response = await api.get("/status", config());
    return response.data.data;
};

export default {
    getAll
};
