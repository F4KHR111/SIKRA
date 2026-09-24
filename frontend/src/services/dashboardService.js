import api from "./api";

const getDashboard = async () => {

    const response = await api.get("/dashboard", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data.data;
};

export default {
    getDashboard
};