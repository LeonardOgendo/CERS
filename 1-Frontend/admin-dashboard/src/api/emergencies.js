import axiosInstance from "./axiosConfig"

export const viewActiveEmergencies = async () => {
    try {
        const response = await axiosInstance.get("/emergencies/active/list/");
        return response.data;
    } catch (error) {
        return {error: error.response?.data || "Failed to load data!"}
    }
}

export const viewResolvedEmergencies = async () => {
    try {
        const response = await axiosInstance.get("/emergencies/resolved/list/");
        return response.data;
    } catch (error) {
        return { error : error.response?.data || "Failed to load data" }
    }
}

export const viewTotalEmergencyReports = async () => {
    try {
        const response = await axiosInstance.get("/emergencies/all/list/");
        return response.data;
    } catch (error) {
        return { error : error.response?.data || "Failed to load data" }
    }
}

