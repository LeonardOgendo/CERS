import { useEffect, useState } from "react";
import { viewActiveEmergencies } from "../../api/Emergencies";

const ActiveEmergencies = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const data = await viewActiveEmergencies();
                if (data.error) {
                    setError(data.error);
                } else {
                    setEmergencies(data);
                }
            } catch (error) {
                setError("An unexpected error occurred!");
            }
        };

        fetchEmergencies();

        // Auto-refresh
        const interval = setInterval(fetchEmergencies, 5000);
        return () => clearInterval(interval);
    }, []);

    const capitalize = (text) => {
        return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
    };

    // Limit text
    const truncateText = (text, length = 50) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    return (
        <div className="container mt-2">
            <h3 className="mb-4">Active Emergencies</h3>
            {error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                    <table className="table table-hover">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Emergency Type</th>
                                <th>Description</th>
                                <th>Severity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergencies.map((emergency, index) => {
                            
                                return (
                                    <tr key={index}>
                                        <td className="fw-bold">{index + 1}</td>
                                        <td>
                                            {emergency.user ? (
                                                capitalize(emergency.user)
                                            ) : (
                                                <em className="text-muted">Anonymous User</em>
                                            )}
                                        </td>
                                        <td>{capitalize(emergency.emergency_type)}</td>
                                        <td>{truncateText(capitalize(emergency.description))}</td>
                                        <td>
                                            <span className={`badge ${
                                                emergency.severity === "critical" ? "bg-danger" :
                                                emergency.severity === "high" ? "bg-warning text-dark" :
                                                "bg-success"
                                            }`}>
                                                {capitalize(emergency.severity)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${
                                                emergency.status === "reported" ? "bg-info text-dark" :
                                                emergency.status === "resolved" ? "bg-success" :
                                                "bg-secondary"
                                            }`}>
                                                {capitalize(emergency.status)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveEmergencies;
