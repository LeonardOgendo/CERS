import { useEffect, useState } from "react";
import { viewTotalEmergencyReports } from "../../api/emergencies";

const TotalEmergencyReports = () => {
    const [emergencies, setEmergencies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const data = await viewTotalEmergencyReports();

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

        const interval = setInterval(fetchEmergencies, 5000);
        return () => clearInterval(interval);
    }, []);

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    const truncateText = (text, length = 50) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    return (
        <div className="container mt-2">
            <h3 className="mb-4">Emergencies History</h3>

            {error ? (
                <p className="text-danger text-center">{error}</p>
            ) : emergencies.length === 0 ? (
                <p className="text-center mt-5">No Emergencies found</p>
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
                            {emergencies.map((emergency, index) => (
                                <tr key={index}>
                                    <td className="fw-bold">{index + 1}</td>
                                    <td>
                                        {emergency.user.first_name} {emergency.user.last_name}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TotalEmergencyReports;
