import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { Link } from "react-router-dom";

const ViewResponders = () => {
    const [responders, setResponders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResponders = async () => {
            try {
                const response = await axiosInstance.get("/admin/responders/view/");
                setResponders(response.data);

            } catch (err) {
                setError("Failed to fetch responders.");
            }
        };

        fetchResponders();

         // Auto-refresh
         const interval = setInterval(fetchResponders, 5000);
         return () => clearInterval(interval);
    }, []);

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    return (
        <div className="container mt-2">
            <h3 className="mb-4">Responders</h3>
            {error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                    <table className="table table-hover">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Responder Status</th>
                                <th>Emergency Category</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responders.map((responder, index) => (
                                <tr key={responder.id}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>
                                        <Link to={`responder/detailview/${responder.id}`} className="text-decoration-none text-dark">
                                        {   responder.full_name}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            responder.responder_status === "available"
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}>
                                            {capitalize(responder.responder_status)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            responder.emergency_category === "unassigned"
                                                ? "bg-secondary"
                                                : responder.emergency_category === "health"
                                                ? "bg-success"
                                                : responder.emergency_category === "fire"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                        }`}>
                                            {capitalize(responder.emergency_category)}
                                        </span>
                                    </td>
                                    <td>{new Date(responder.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewResponders;
