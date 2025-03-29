import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IncidentHistory = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [filter, setFilter] = useState({
    emergency_type: "",
    status: "",
    severity: ""
  });

  // Format emergency type for display
  const formatEmergencyType = (type) => {
    const types = {
      health: "Health Emergency",
      security: "Security Emergency",
      fire: "Fire Emergency"
    };
    return types[type] || type;
  };

  // Format status with colors
  const formatStatus = (status) => {
    const statusStyles = {
      reported: "badge bg-warning text-dark",
      in_progress: "badge bg-primary text-white",
      resolved: "badge bg-success text-white"
    };
    const statusText = {
      reported: "Reported",
      in_progress: "In Progress",
      resolved: "Resolved"
    };
    return (
      <span className={statusStyles[status]}>
        {statusText[status]}
      </span>
    );
  };

  // Fetch incidents from API
  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://127.0.0.1:8000/api/emergencies/list?page=${pagination.page}&page_size=${pagination.pageSize}`;

      // Add filters to URL if they exist
      if (filter.emergency_type) {
        url += `&emergency_type=${filter.emergency_type}`;
      }
      if (filter.status) {
        url += `&status=${filter.status}`;
      }
      if (filter.severity) {
        url += `&severity=${filter.severity}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      setIncidents(response.data.results);
      setPagination(prev => ({
        ...prev,
        totalCount: response.data.count
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load incident history");
        toast.error("Failed to load incidents");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchIncidents();
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({
      emergency_type: "",
      status: "",
      severity: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Initial fetch and when pagination or filters change
  useEffect(() => {
    fetchIncidents();
  }, [pagination.page, pagination.pageSize]);

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-danger">
            <i className="bi bi-clock-history me-2"></i>
            My Emergency Reports
          </h5>
          <div>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => fetchIncidents()}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-1"></span>
              ) : (
                <i className="bi bi-arrow-clockwise me-1"></i>
              )}
              Refresh
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => navigate("/user/emergency/report")}
            >
              <i className="bi bi-plus-circle me-1"></i>
              New Report
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Filter Section */}
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Emergency Type</label>
              <select
                name="emergency_type"
                value={filter.emergency_type}
                onChange={handleFilterChange}
                className="form-select form-select-sm"
              >
                <option value="">All Types</option>
                <option value="health">Health Emergency</option>
                <option value="security">Security Emergency</option>
                <option value="fire">Fire Emergency</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="form-select form-select-sm"
              >
                <option value="">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Severity</label>
              <select
                name="severity"
                value={filter.severity}
                onChange={handleFilterChange}
                className="form-select form-select-sm"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading emergency reports...</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 text-muted">No emergency reports found</p>
              <button
                className="btn btn-danger mt-2"
                onClick={() => navigate("/user/emergency/report")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Report New Emergency
              </button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Location</th>
                      <th>Reported</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((incident) => (
                      <tr key={incident.id}>
                        <td>
                          <span className="fw-bold">
                            {formatEmergencyType(incident.emergency_type)}
                          </span>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "200px" }} title={incident.description}>
                            {incident.description}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            incident.severity === 'critical' ? 'bg-danger' :
                            incident.severity === 'high' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
                          </small>
                        </td>
                        <td>
                          {moment(incident.created_at).format("MMM D, YYYY h:mm A")}
                        </td>
                        <td>
                          {formatStatus(incident.status)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/user/emergency/${incident.id}`)}
                            title="View details"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalCount > pagination.pageSize && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(Math.ceil(pagination.totalCount / pagination.pageSize)).keys()].map(num => (
                      <li key={num} className={`page-item ${pagination.page === num + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(num + 1)}
                        >
                          {num + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.page * pagination.pageSize >= pagination.totalCount ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page * pagination.pageSize >= pagination.totalCount}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentHistory;