import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

const TrackResponseStatus = () => {
  const { user } = useContext(AuthContext);
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
    status: "",
    search: ""
  });

  const formatStatus = (status) => {
    const statusStyles = {
      reported: "badge bg-secondary text-white",
      acknowledged: "badge bg-info text-white",
      in_progress: "badge bg-primary text-white",
      en_route: "badge bg-warning text-dark",
      on_site: "badge bg-orange text-white",
      resolved: "badge bg-success text-white"
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
      <span className={statusStyles[status]}>
        {statusText[status] || status}
      </span>
    );
  };

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://127.0.0.1:8000/api/emergencies/list?page=${pagination.page}&page_size=${pagination.pageSize}`;

      if (filter.status) {
        url += `&status=${filter.status}`;
      }
      if (filter.search) {
        url += `&search=${filter.search}`;
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
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load incident history");
        toast.error("Failed to load response status");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchIncidents();
  };

  const resetFilters = () => {
    setFilter({
      status: "",
      search: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusTimeline = (incident) => {
    const statusOrder = ["reported", "acknowledged", "in_progress", "en_route", "on_site", "resolved"];
    const currentIndex = statusOrder.indexOf(incident.status);

    return (
      <div className="timeline">
        {statusOrder.map((status, index) => (
          <div
            key={status}
            className={`timeline-item ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-status">{formatStatus(status)}</span>
              {index === currentIndex && incident.status_updated_at && (
                <small className="text-muted d-block">
                  {moment(incident.status_updated_at).fromNow()}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchIncidents();
  }, [pagination.page, pagination.pageSize]);

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-primary">
            <i className="bi bi-clock-history me-2"></i>
            Response Status Tracking
          </h5>
          <div>
            <button
              className="btn btn-sm btn-outline-primary"
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
          </div>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="form-select form-select-sm"
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
            <div className="col-md-6 d-flex align-items-end">
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
              <p className="mt-2">Loading response status...</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 text-muted">No emergency responses found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Emergency</th>
                      <th>Reporter</th>
                      <th>Location</th>
                      <th>Current Status</th>
                      <th>Status Timeline</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((incident) => (
                      <tr key={incident.id}>
                        <td>
                          <div className="fw-bold">{incident.emergency_type}</div>
                          <small className="text-muted text-truncate" style={{ maxWidth: "150px" }}>
                            {incident.description}
                          </small>
                        </td>
                        <td>
                          {incident.user?.first_name} {incident.user?.last_name}
                        </td>
                        <td>
                          <small>
                            {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
                          </small>
                        </td>
                        <td>
                          {formatStatus(incident.status)}
                        </td>
                        <td>
                          <div style={{ maxWidth: "300px" }}>
                            {getStatusTimeline(incident)}
                          </div>
                        </td>
                        <td>
                          {moment(incident.updated_at).format("MMM D, h:mm A")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 15px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -10px;
          top: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #dee2e6;
          border: 2px solid #fff;
        }
        .timeline-item.completed .timeline-dot {
          background-color: #0d6efd;
        }
        .timeline-item.current .timeline-dot {
          background-color: #198754;
          width: 14px;
          height: 14px;
          left: -11px;
        }
        .timeline-content {
          margin-left: 10px;
        }
        .timeline-status {
          font-size: 0.8rem;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: -6px;
          top: 17px;
          bottom: -15px;
          width: 2px;
          background-color: #dee2e6;
        }
        .timeline-item.completed:not(:last-child)::after {
          background-color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default TrackResponseStatus;