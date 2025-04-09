import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";

const ResponderAssignmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [responder, setResponder] = useState(null);
    const [category, setCategory] = useState("");

    useEffect(() => {
        const fetchResponder = async () => {
            try {
                const response = await axiosInstance.get(`/admin/responder/detailview/${id}`);
                setResponder(response.data);
                setCategory(response.data.emergency_category || "");
            } catch (error) {
                console.error("Error fetching responder:", error);
            }
        };

        fetchResponder();
    }, [id]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleUpdate = async () => {
        try {
            const response = await axiosInstance.patch(`/admin/responder/detailview/${id}/`, {
                emergency_category: category,
            });

            toast.success("Emergency category updated successfully.")
            setResponder(prev => ({
                ...prev,
                emergency_category: category,
            }));
        } catch (error) {
            console.error("Update Failed:", error);
            toast.error("Failed to update category");
        }
    };

    const capitalize = (text) => {
        if (!text) return "";
        return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
    };

    
    if (!responder) {
        return <p className="text-center mt-4">Loading responder details...</p>;
    };

    return (
        <div className="ms-2 mt-3 me-2">
            <div className="p-4 shadow rounded bg-white ps-4" style={{ width: "100%", height: '55vh' }}>
                <h4 className="mb-4 text-primary">Responder Details</h4>

                <div className="d-flex">
                    <div className="detailview-wrapper d-flex border rounded py-3 ps-3 me-2">
                        <div>
                            <div className="mb-3">
                                <span className="text-secondary fw-bold ">Name: </span>
                            </div>
                                
                            <div className="mb-3">
                                <span className="text-secondary fw-bold">Status: </span>
                            </div>
                            
                            <div className="mb-3">
                                <span className="text-secondary fw-bold">Emergency Category: </span>
                            </div>
                        </div>
                        <div className="ms-3">
                            <div className="mb-3">
                                <span className="custom-det text-dark">{responder.full_name}</span>
                            </div>

                            <div className="mb-3">
                                <span className={`badge ${
                                    responder.responder_status === "available" ? "bg-success" : "bg-warning"
                                } custom-det`}>
                                    {capitalize(responder.responder_status)}
                                </span>
                            </div>

                            <div className="mb-3">
                                
                                <span className={`custom-det badge ${
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
                    <div style={{ width: '50%' }} className="border rounded py-4 ps-3">
                        <p>Assign Emergency Category</p>

                        <div className="mt-3">
                            <select
                            style={{ width: '250px' }}
                                id="categorySelect"
                                className="form-control"
                                onChange={handleCategoryChange}
                            >
                                <option value="">Select Category</option>
                                <option value="health">Health</option>
                                <option value="security">Security</option>
                                <option value="fire">Fire</option>
                            </select>
                        </div>

                        <button 
                            className="btn btn-primary btn-sm fw-bold mt-3"
                            onClick={handleUpdate}
                            disabled={!category}
                        >
                            Update Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderAssignmentDetail;
