import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";

const ResponderDetail = () => {
    const { id } = useParams();
    const [responder, setResponder] = useState(null);

    useEffect(() => {
        const fetchResponder = async () => {
            try {
                const response = await axiosInstance.get(`/admin/responder/detailview/${id}`);
                setResponder(response.data);
            } catch (error) {
                console.error("Error fetching responder:", error);
            }
        };

        fetchResponder();
    }, [id]);

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    const truncateWords = (text, maxWords = 20) => {
        if (!text) return "";
        const words = text.trim().split(/\s+/);
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(" ") + "...";
      };
      

    if (!responder) {
        return <p className="text-center mt-4">Loading responder details...</p>;
    }

    return (
        <div className="container-fluid px-4 mt-4">
            <div className="p-4 shadow-sm rounded-4 bg-white">
                <h4 className="text-primary fw-semibold mb-4">Responder Details</h4>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div style={{ height: '350px' }} className="border rounded p-4 bg-light">
                            <h5 className="text-secondary mb-3 fw-semibold">Responder Info</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted fw-medium">Name</span>
                                <span className="text-dark">{responder.full_name}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted fw-medium">Status</span>
                                <span className={`badge px-3 py-1 rounded-pill ${
                                    responder.responder_status === "available" ? "bg-success" : "bg-warning text-dark"
                                }`}>
                                    {capitalize(responder.responder_status)}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted fw-medium">Emergency Category</span>
                                <span className={`badge px-3 py-1 rounded-pill ${
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
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ height: '350px'}} className="border rounded p-3 bg-light">
                            <h5 className="text-secondary mb-3 fw-semibold">Assigned Emergency</h5>
                            {responder.emergencies.length > 0 ? (
                                responder.emergencies.map((emergency, index) => (
                                    <div key={index} className="p-3 border rounded-3 bg-white shadow-sm">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted fw-medium">Emergency Type :</span>
                                            <span className="text-dark">{capitalize(emergency.emergency_type)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted fw-medium">Severity :</span>
                                            <span className="text-dark">{capitalize(emergency.severity)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted fw-medium">Status :</span>
                                            <span className="text-dark">{capitalize(emergency.status)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted fw-medium">Description :</span>
                                            <p className="mb-0 text-dark border mt-2 p-2 rounded-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ducimus tempora odit laudantium atque necessitatibus placeat delectus esse foed sndekl.</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No emergencies assigned.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderDetail;
