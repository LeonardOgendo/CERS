    import { Link, useNavigate } from "react-router-dom";
    import { useState } from "react";
    import UsersAPI from "../../api/users";

    export default function Register() {
      const [formData, setFormData] = useState({
        identifier: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      const navigate = useNavigate();

      const [errors, setErrors] = useState({});
      const [successMessage, setSuccessMessage] = useState("");

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
        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";

        // identifier validation
        const identifierRegex = /^(STU|SID)\/\d{5}$/;

        if (!formData.identifier.trim()) {
          newErrors.identifier = "Student ID / Staff ID is required";
        } else if (!identifierRegex.test(formData.identifier)) {
          newErrors.identifier = "Invalid format. Use STU/XXXXX or SID/XXXXX";
        }

        // other
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";

        return newErrors;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");

        // Client-side validation
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        try {
          const { confirm_password, ...submitData } = formData;
          await UsersAPI.post("/register/", submitData);
          setSuccessMessage("Registration successful! You can now log in.");
          setFormData({
            identifier: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
          });

          setTimeout(() => {
            navigate('/')
          }, 3500)

        } catch (error) {
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          } else {
            setErrors({ general: "An unexpected error occurred. Please try again." });
          }
        }
      };

      return (
        <div className="container">
          <div className="card text-black m-5 shadow-none border-0">
            <div className="card-body">
              <div className="row">
                {/*-- Image --*/}
                <div className="col-md-10 col-lg-6 order-1 order-lg-1 d-flex align-items-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                    className="img-fluid"
                    alt="Sign Up"
                  />
                </div>

                {/*-- Form --*/}
                <div className="col-md-10 col-lg-6 order-2 order-lg-2 d-flex flex-column align-items-center pt-3 custom-signup">
                  <p className="text-center fs-3 fw-bold mb-4 link-danger">Sign Up</p>

                  {successMessage && <div className="alert alert-success">{successMessage}</div>}
                  {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                  <div className="custom-signup-block">
                    <form onSubmit={handleSubmit}>

                      <div className="mb-4 w-100">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                      </div>


                      <div className="mb-4 w-100">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                      </div>


                      <div className="mb-4 w-100">
                        <label htmlFor="user_id" className="form-label">Student ID / Staff ID</label>
                        <input
                          type="text"
                          id="user_id"
                          className={`form-control ${errors.identifier ? "is-invalid" : ""}`}
                          name="identifier"
                          value={formData.identifier}
                          onChange={handleChange}
                        />
                        {errors.identifier && <div className="invalid-feedback">{errors.identifier}</div>}
                      </div>


                      <div className="mb-4 w-100">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>


                      <div className="mb-4 w-100">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          id="password"
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>


                      <div className="mb-4 w-100">
                        <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          id="confirm_password"
                          className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                        />
                        {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                      </div>

                      <button type="submit" className="btn custom-btn px-5 mb-3 btn-danger w-100">Sign Up</button>

                      <p className="small fw-bold mt-2 pt-1 mb-2">
                        Already have an account? <Link to="/" className="link-danger">Login</Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
