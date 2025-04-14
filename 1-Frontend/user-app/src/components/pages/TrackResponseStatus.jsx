import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const TrackResponseStatus = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    emergency_type: "",
    status: ""
  });

  const fetchEmergencies = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/emergencies/list`;
      if (filter.emergency_type || filter.status) {
        url += `?emergency_type=${filter.emergency_type}&status=${filter.status}`;
      }

      const response = await axiosInstance.get(url);
      // Filter to only show emergencies reported by the current user
      const userEmergencies = response.data.results.filter(
        emergency => emergency.user?.id === user.id
      );
      setEmergencies(userEmergencies);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load emergencies");
      console.error("Error fetching emergencies", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchEmergencies();
  };

  const resetFilters = () => {
    setFilter({
      emergency_type: "",
      status: ""
    });
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const formatEmergencyType = (type) => {
    const types = {
      health: "Health Emergency",
      security: "Security Emergency",
      fire: "Fire Emergency"
    };
    return types[type] || type;
  };

  const formatStatus = (status) => {
    const statusStyles = {
      reported: "badge bg-secondary",
      acknowledged: "badge bg-info",
      in_progress: "badge bg-primary",
      en_route: "badge bg-warning text-dark",
      on_site: "badge bg-orange",
      resolved: "badge bg-success"
    };

    const statusText = {
      reported: "Reported",
      acknowledged: "Acknowledged",
      in_progress: "In Progress",
      en_route: "En Route",
      on_site: "On Site",
      resolved: "Resolved"
    };

    return (
      <span className={`${statusStyles[status]} text-white`}>
        {statusText[status] || status}
      </span>
    );
  };

  const getStatusTimeline = (emergency) => {
    const statusOrder = [
      "reported",
      "acknowledged",
      "in_progress",
      "en_route",
      "on_site",
      "resolved"
    ];

    const currentStatusIndex = statusOrder.indexOf(emergency.status);

    return (
      <div className="timeline">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <div key={status} className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h6>{formatStatusText(status)}</h6>
                {isCurrent && emergency.responder && (
                  <small className="text-muted">
                    Responder: {emergency.responder.name || "Assigned"}
                  </small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const formatStatusText = (status) => {
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchEmergencies}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0 text-primary">
            <i className="bi bi-search me-2"></i>
            Track Emergency Response Status
          </h5>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Emergency Type</label>
              <select
                name="emergency_type"
                value={filter.emergency_type}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="health">Health Emergency</option>
                <option value="security">Security Emergency</option>
                <option value="fire">Fire Emergency</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_progress">In Progress</option>
                <option value="en_route">En Route</option>
                <option value="on_site">On Site</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end gap-2">
              <button
                className="btn btn-primary"
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>

          {emergencies.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 text-muted">No emergency reports found</p>
              <button
                className="btn btn-danger mt-2"
                onClick={() => navigate("/emergency/report")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Report New Emergency
              </button>
            </div>
          ) : (
            <div className="row">
              {emergencies.map((emergency) => (
                <div key={emergency.id} className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{formatEmergencyType(emergency.emergency_type)}</h5>
                      {formatStatus(emergency.status)}
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <h6 className="text-muted">Description</h6>
                        <p>{emergency.description}</p>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <h6 className="text-muted">Severity</h6>
                          <span className={`badge ${
                            emergency.severity === 'critical' ? 'bg-danger' :
                            emergency.severity === 'high' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                            {emergency.severity}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-muted">Reported</h6>
                          <p>{moment(emergency.created_at).format("MMM D, YYYY h:mm A")}</p>
                        </div>
                      </div>

                      <h6 className="text-muted mb-3">Response Progress</h6>
                      {getStatusTimeline(emergency)}

                      {emergency.responder && (
                        <div className="mt-3">
                          <h6 className="text-muted">Assigned Responder</h6>
                          <p>
                            {emergency.responder.name || "Responder"} - {emergency.responder.organization || "Organization"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="card-footer bg-white">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/emergency/${emergency.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackResponseStatus;