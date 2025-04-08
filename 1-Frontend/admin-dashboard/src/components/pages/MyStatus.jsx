import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const MyStatus = () => {
    const [responderData, setResponderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    const id = user?.responder_id;
    

    // For now
    const responseHistory = [];

    const fetchResponderData = async () => {
        try {
            const response = await axiosInstance.get(`/admin/responder/detailview/${id}/`);
            setResponderData(response.data);
        } catch (error) {
            setError("Failed to fetch responder data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponderData();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    
    const { full_name, responder_status, emergency_category, emergencies } = responderData;

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                {/* My Status Section */}
                <div className="border rounded p-4 me-3 w-50 bg-light">
                    <h5 className="text-primary mb-3">My Status</h5>
                    <div className="p-3 bg-white rounded shadow-sm">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Responder Name:</span>
                            <span className="fw-bold">{full_name}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Status:</span>
                            <span className={`fw-bold ${responder_status === 'engaged' ? 'text-danger' : 'text-success'}`}>
                                {responder_status === 'engaged' ? 'Engaged' : 'Available'}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-muted">Emergency Category:</span>
                            <span className="fw-bold">{capitalize(emergency_category)}</span>
                        </div>
                    </div>
                </div>

                
                <div className="border rounded p-4 w-50 bg-light">
                    <h5 className="text-primary mb-3">Assigned Emergency</h5>
                    <div className="p-3 bg-white rounded shadow-sm">
                        {emergencies && emergencies.length > 0 ? (
                            <>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Emergency Type:</span>
                                    <span className="fw-bold">{capitalize(emergencies[0].emergency_type)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Severity:</span>
                                    <span className={`fw-bold ${emergencies[0].severity === 'critical' ? 'text-danger' : 'text-warning'}`}>
                                        {emergencies[0].severity.charAt(0).toUpperCase() + emergencies[0].severity.slice(1)}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Status:</span>
                                    <span className="fw-bold">{emergencies[0].status.charAt(0).toUpperCase() + emergencies[0].status.slice(1)}</span>
                                </div>
                                <div className="">
                                    <span className="text-muted">Description:</span>
                                    <p style={{ fontSize: '0.95rem' }} className="mt-2 border px-2 py-3 rounded-2">{emergencies[0].description}</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-muted">No assigned emergencies.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Response History Section */}
            <div className="mt-5">
                <h5 className="text-primary mb-3">Response History</h5>

                {responseHistory.length > 0 ? (
                    <div className="table-responsive bg-light p-3 rounded shadow-sm">
                        <table className="table table-hover table-borderless align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Emergency Type</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responseHistory.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><span className="fw-bold">{item.type}</span></td>
                                        <td>
                                            <span className={`badge ${
                                                item.status === "Resolved"
                                                    ? "bg-success"
                                                    : item.status === "Completed"
                                                    ? "bg-secondary"
                                                    : "bg-warning text-dark"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.location}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4 text-center rounded text-muted border">
                        No Response History Available
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStatus;
