import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";


const TotalUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get("/users/all-users/");
                setUsers(response.data);

            } catch (err) {
                setError("Failed to fetch users.");
            }
        };

        fetchUsers();

        // Auto-refresh every 5 seconds (optional)
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    return (
        <div className="container mt-2">
            <h3 className="mb-4">All Users</h3>
            {error ? (
                <p className="text-danger text-center">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-center mt-5">No Registered Users</p>
            ) : (
                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                    <table className="table table-hover">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>{capitalize(user.first_name)} {capitalize(user.last_name)}</td>
                                    
                                    <td>{user.email || "N/A"}</td>
                                    <td>
                                        <span className={`badge ${
                                            user.role === "admin"
                                                ? "bg-dark"
                                                : user.role === "responder"
                                                ? "bg-primary"
                                                : "bg-secondary"
                                        }`}>
                                            {capitalize(user.role)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TotalUsers;
