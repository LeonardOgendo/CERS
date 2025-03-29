import axios from "axios";

const EmergencyAPI = axios.create({
    baseURL: "http://127.0.0.1:8000/api/emergencies/",
    headers: {
        "Content-Type": "application/json"
    }
});


EmergencyAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default EmergencyAPI;