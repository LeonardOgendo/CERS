import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/users";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

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

  // Client-side validation
  const validateForm = () => {
    let newErrors = {};
  
    const emailPattern = /^[a-z]{1}[a-z]+@cers\.ke$/; // e.g., emusk@cers.ke
  
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email is required.";
    } else if (!emailPattern.test(formData.identifier)) {
      newErrors.identifier = "Enter a valid email in 'first initial + last name' format (e.g., emusk@cers.ke).";
    }
  
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      const response = await loginUser(formData);

      if (response.error) {
        setErrors({ general: response.error.identifier?.[0] || response.error.password?.[0] || response.error.non_field_errors?.[0] || "Invalid credentials. Please try again." });
        return;
      }

      if (!response.access || !response.refresh) {
        setErrors({ general: "Invalid response from server. Please try again!"});
        return;
      }
     
      // Saving to local storage
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      // Updating context
      login(response.user);

      setSuccessMessage("Login successful! Redirecting ...");
      setTimeout(() => {
        navigate('/admin')
      }, 1500)

    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <>
      <div className="container-fluid p-3 login">
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
              <h5 className="mb-4 me-3 text-primary login-header">LOGIN</h5>
            </div>

            {/* Display Errors */}
            {errors.general && <p className="text-danger">{errors.general}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  className={`form-control mb-1 ${errors.identifier ? "is-invalid" : ""}`}
                  type="email"
                  name="identifier"
                  placeholder="Email Address"
                  value={formData.identifier}
                  onChange={handleChange}
                />
                {errors.identifier && <div className="text-danger">{errors.identifier}</div>}
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
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
              

              <div className="d-flex justify-content-between mb-4">
                <div>
                  <input type="checkbox" id="rememberMe" />
                  <label htmlFor="rememberMe" className="ms-2">Remember me</label>
                </div>
                <a href="#" className="text-muted text-decoration-none">Forgot password?</a>
              </div>

              <div className="text-center text-md-start mt-4 pt-2">
                <button className="btn btn-primary px-5 mb-3" style={{ width: "100%" }} type="submit">
                  Login
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-danger">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
