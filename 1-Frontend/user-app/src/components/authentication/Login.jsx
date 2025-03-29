import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UsersAPI from "../../api/users";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Student ID / Staff ID is required";
    } else {
      const identifierRegex = /^(STU|SID)\/\d{5}$/;
      if (!identifierRegex.test(formData.identifier)) {
        newErrors.identifier = "Invalid format. Use STU/XXXXX or SID/XXXXX";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await UsersAPI.post("/login/", formData);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      login(response.data.user);

      setSuccessMessage("Login successful! Redirecting ...");
      setTimeout(() => navigate("/user"), 1500);
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="container-fluid login d-flex">
      <div className="row">
        <div className="col-md-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </div>

        <div className="col-md-6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h5 className="fs-4 mb-4 me-3 text-danger login-header">Login</h5>
          </div>

          {successMessage && <p className="text-success">{successMessage}</p>}
          {errors.general && <p className="text-danger">{errors.general}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className={`form-control mb-1 ${errors.identifier ? "is-invalid" : ""}`}
                type="text"
                name="identifier"
                placeholder="Student ID / Staff ID"
                value={formData.identifier}
                onChange={handleChange}
              />
              {errors.identifier && <div className="invalid-feedback">{errors.identifier}</div>}
            </div>

            <div className="mb-4">
              <input
                className={`form-control mb-1 ${errors.password ? "is-invalid" : ""}`}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe" className="ms-2">
                  Remember me
                </label>
              </div>
              <a href="#" className="link-primary text-decoration-none">
                Forgot password?
              </a>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button type="submit" className="btn custom-btn px-5 mb-3 btn-danger" style={{ width: "100%" }}>
                Login
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-2">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;