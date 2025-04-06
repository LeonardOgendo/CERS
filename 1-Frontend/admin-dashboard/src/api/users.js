import axiosInstance from "./axiosConfig";

// Register User
export const registerUser = async (userData) => {
    try {
      const response = await axiosInstance.post("/users/register/", userData);
      return response.data;
    } catch (error) {
      const errData = error.response?.data;
  
      if (typeof errData === "object" && errData !== null) {
        return { errors: errData };
      }
      return {
        error: errData?.detail || "Something went wrong. Please try again.",
      };
    }
  };

// Login user
export const loginUser = async (loginData) => {
    try {
        const response = await axiosInstance.post("/users/login/", loginData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data || "Invalid credentials" };
    }
}