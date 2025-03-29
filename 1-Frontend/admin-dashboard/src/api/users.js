import axiosInstance from "./axiosConfig";

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/register/", userData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data || "An error occured" };
    }
}

// Login user
export const loginUser = async (loginData) => {
    try {
        const response = await axiosInstance.post("/users/login/", loginData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data || "Invalid credentials" };
    }
}