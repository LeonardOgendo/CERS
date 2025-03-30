import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/users";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const isDisabled = formData.accountType === "";

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    })); // Clear errors on input
  };

  // Validate inputs
  const validateForm = () => {
    let newErrors = {};

    if (!formData.accountType) newErrors.accountType = "Account type is required.";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

    // Email validation
    const emailPattern = /^[a-z]{1}[a-z]+@cers\.ke$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email in 'first initial + last name' format (e.g., emusk@cers.ke).";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      const response = await registerUser({
        identifier: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.accountType,
      });

      if (response.errors) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...response.errors,
        }));
      } else if (response.error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: response.error,
        }));
      } else {
        setSuccess("Account created successfully");
        toast.success("Account created succesfully! You can now log in.")
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="container">
      <div className="card text-black m-5 shadow-none border-0">
        <div className="card-body">
          <div className="row">
            {/* Image */}
            <div className="col-md-10 col-lg-6 order-1 order-lg-1 d-flex align-items-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                className="img-fluid"
                alt="Sign Up"
              />
            </div>

            {/* Form */}
            <div className="col-md-10 col-lg-6 order-2 order-lg-2 d-flex flex-column align-items-center pt-3 custom-signup">
              <p className="text-center fs-3 fw-bold mb-4 text-primary">Create Account</p>

              {success && <p className="text-success">{success}</p>}
              {errors.general && <p className="text-danger">{errors.general}</p>}

              <form className="custom-signup-block w-100" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="accountType" className="form-label">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    className={`form-control ${errors.accountType ? "is-invalid" : ""}`}
                    value={formData.accountType}
                    onChange={handleChange}
                  >
                    <option value="">Select Account Type</option>
                    <option value="admin">Admin</option>
                    <option value="responder">Responder</option>
                  </select>
                  {errors.accountType && <div className="invalid-feedback">{errors.accountType}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isDisabled}>
                  Sign Up
                </button>
              </form>

              <p className="small fw-bold mt-2 pt-1 mb-2">
                Already have an account? <Link to="/" className="text-primary text-decoration-none">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
