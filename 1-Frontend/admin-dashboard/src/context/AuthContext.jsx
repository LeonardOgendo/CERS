 import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


export const AuthContext = createContext();


const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {

        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const accessToken = localStorage.getItem('access_token');

            if (refreshToken) {
                await axiosInstance.post("/users/logout/",
                    {refresh_token: refreshToken},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            }

            // Clear state and local storage
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            toast.success("Logout successful");
            setTimeout(() => {
                navigate('/')
            }, 500)

        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;