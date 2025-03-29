import { useState, useContext } from "react";
import EmergencyAPI from "../../api/emergencyAPI"; // Your emergency API instance
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmergencyReport() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emergency_type: "health",
    description: "",
    severity: "high",
    latitude: null,
    longitude: null
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setError(null);
        },
        (error) => {
          setError("Error fetching location: " + error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      const response = await UsersAPI.post("token/refresh/", { refresh });
      localStorage.setItem("access_token", response.data.access);
      return true;
    } catch (error) {
      logout();
      navigate("/login");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    // Validation
    if (!formData.description.trim()) {
      setError("Please provide a description of the emergency");
      setIsSubmitting(false);
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError("Please share your location first");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await EmergencyAPI.post("report/", formData);

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          emergency_type: "health",
          description: "",
          severity: "high",
          latitude: null,
          longitude: null
        });

        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request with new token
          await handleSubmit(e);
          return;
        }
      }

      if (err.response) {
        setError(
          err.response.data?.detail ||
          err.response.data?.message ||
          Object.values(err.response.data)?.[0]?.[0] || // Handle serializer errors
          "Failed to submit report"
        );
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Request error: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid d-flex border rounded pt-4 pe-4 pb-4 mt-2 bg-white">
      <div className="row">
        <div className="col-md-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Report Illustration"
          />
        </div>

        <div className="col-md-6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h5 className="fs-4 mb-4 me-3 text-danger fw-bold">Report Emergency</h5>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              Emergency reported successfully! Help is on the way.
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess(false)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Emergency Type</label>
              <select
                className="form-select"
                name="emergency_type"
                value={formData.emergency_type}
                onChange={handleChange}
                required
              >
                <option value="health">Health Emergency</option>
                <option value="security">Security Emergency</option>
                <option value="fire">Fire Emergency</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe the emergency in detail..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Severity Level</label>
              <div className="d-flex flex-wrap gap-3">
                {[
                  { value: "critical", label: "Critical" },
                  { value: "high", label: "High" },
                  { value: "low", label: "Low" }
                ].map((level) => (
                  <div className="form-check" key={level.value}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="severity"
                      id={`severity-${level.value}`}
                      value={level.value}
                      checked={formData.severity === level.value}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor={`severity-${level.value}`}>
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <button
                type="button"
                className={`btn w-100 ${formData.latitude ? "btn-success" : "btn-primary"}`}
                onClick={handleShareLocation}
                disabled={isSubmitting}
              >
                {formData.latitude ? (
                  <><i className="bi bi-check-circle-fill me-2"></i>Location Captured</>
                ) : (
                  <><i className="bi bi-geo-alt-fill me-2"></i>Share My Location</>
                )}
              </button>
              {formData.latitude && (
                <div className="mt-2 text-muted small">
                  <i className="bi bi-info-circle-fill me-1"></i>
                  Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                className="btn btn-danger py-2"
                type="submit"
                disabled={isSubmitting || !formData.latitude}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Reporting Emergency...
                  </>
                ) : (
                  <>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Submit Emergency Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}