import axiosInstance from "./axiosConfig"

export const viewActiveEmergencies = async () => {
    try {
        const response = await axiosInstance.get("/emergencies/list/");
        return response.data;
    } catch (error) {
        return {error: error.response?.data || "An error occured!"}
    }
}