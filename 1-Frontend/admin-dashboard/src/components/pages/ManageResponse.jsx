import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";

const ManageResponse = () => {
    const { user } = useContext(AuthContext);
    const [emergency, setEmergency] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [message, setMessage] = useState("");

    const fetchEmergency = async () => {
        try {
            const response = await axiosInstance.get(`/emergencies/responder/emergencies/${user.responder_id}/`);
            const emergencies = response.data;
            const current = emergencies[0] || null;
            setEmergency(current);
            setSelectedStatus(current?.status || "");
        } catch (error) {
            console.error("Error fetching emergency", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedStatus) return;

        try {
            await axiosInstance.patch(`/emergencies/update_status/${emergency.id}/`, {
                status: selectedStatus.toLowerCase(),
            });
            setMessage("Status updated successfully.");
            fetchEmergency();
        } catch (error) {
            console.error("Error updating status", error);
            setMessage("Failed to update status.");
        }
    };

    useEffect(() => {
        fetchEmergency();
    }, []);

    const formatStatus = (status) => {
        const statusMap = {
            reported: "Reported",
            acknowledged: "Acknowledged",
            in_progress: "In Progress",
            en_route: "En Route",
            on_site: "On Site",
            resolved: "Resolved"
        };
        return statusMap[status] || status;
    };

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    if (loading) return <div>Loading...</div>;
    if (!emergency) return <div className="text-center mt-4">No assigned emergency found.</div>;

    return (
        <div
            className="container mt-2 p-4 rounded"
            style={{
                height: "70vh",
                backgroundColor: "#ffffff",
                display: "flex",
                gap: "10px"
            }}
        >
            <div className="border rounded p-4 w-50">
                <h5 className="text-primary mb-4">Emergency Details</h5>
                <div>
                    <div className="d-flex">
                        <div>
                            <p className="fw-medium">User :</p>
                            <p className="fw-medium">Emergency Type :</p>
                            <p className="fw-medium">Severity :</p>
                            <p className="fw-medium">Status :</p>
                        </div>
                        <div className="ms-3">
                            <p>{emergency.user.first_name} {emergency.user.last_name}</p>
                            <p>{capitalize(emergency.emergency_type)}</p>
                            <p>{capitalize(emergency.severity)}</p>
                            <p>{formatStatus(emergency.status)}</p>
                        </div>
                    </div>
                    <p className="fw-medium">Description :</p>
                    <p style={{ fontSize: '0.95rem' }} className="border py-3 rounded-2 px-2">{emergency.description}</p>
                </div>
            </div>

            <div className="border rounded p-4 w-50">
                <h5 className="text-primary mb-4">Update Emergency Status</h5>
                <div>
                    <label htmlFor="statusSelect" className="form-label">Select Status</label>
                    <select
                        id="statusSelect"
                        className="form-select mb-3"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="in_progress">In Progress</option>
                        <option value="en_route">En Route</option>
                        <option value="on_site">On Site</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleStatusUpdate}
                        disabled={!selectedStatus}
                    >
                        Update Status
                    </button>
                    {message && <div className="mt-3 text-muted">{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default ManageResponse;