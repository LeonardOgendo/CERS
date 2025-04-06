import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";

const ResponderDetail = () => {
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


    
    if (!responder) {
        return <p className="text-center mt-4">Loading responder details...</p>;
    }

    return (
        <div className="ms-2 mt-3 me-2">
            <div className="p-4 shadow rounded bg-white" style={{ width: "100%", height: '55vh' }}>
                <h4 className="mb-4 text-primary">Responder Details</h4>

                <div className="d-flex">
                    <div style={{ width: '50%' }}>
                        <div className="mb-3">
                            <span className="text-secondary">Name: </span>
                            <span className="text-dark">{responder.full_name}</span>
                        </div>

                        <div className="mb-3">
                            <span className="text-secondary">Status: </span>
                            <span className={`badge ${
                                responder.responder_status === "available" ? "bg-success" : "bg-danger"
                            }`}>
                                {responder.responder_status}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="text-secondary">Emergency Category: </span>
                            <span className={`badge ${
                                responder.emergency_category === "unassigned"
                                    ? "bg-secondary"
                                    : responder.emergency_category === "health"
                                    ? "bg-success"
                                    : responder.emergency_category === "fire"
                                    ? "bg-warning text-dark"
                                    : "bg-danger"
                            }`}>
                                {responder.emergency_category}
                            </span>
                        </div>
                    </div>
                    <div style={{ width: '50%' }} className="border rounded py-4 ps-3 me-5">
                        <p>Assign Emergency Category</p>

                        <div className="mt-3">
                            <select
                            style={{ width: '250px' }}
                                id="categorySelect"
                                className="form-control"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Select Category</option>
                                <option value="health">Health</option>
                                <option value="security">Security</option>
                                <option value="fire">Fire</option>
                            </select>
                        </div>

                        <button className="btn btn-primary btn-sm fw-bold mt-3">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderDetail;
