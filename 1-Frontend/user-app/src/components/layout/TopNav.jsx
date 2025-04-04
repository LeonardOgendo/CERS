import { Link, useNavigate } from "react-router-dom";
import Search from "../ui/Search";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const TopNav = () => {
    const { user, logout } = useContext(AuthContext);
    const [dropdown, setDropdown] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    const handleViewProfile = () => {
        navigate('/user/account');
        setDropdown(null);
    };

    return (
        <div className="top-nav d-flex justify-content-end mb-2">
            <div className="search-bar d-flex">
                <i className="fa fa-search mt-1 me-1 text-secondary"></i>
                <Search />
            </div>
            <div className="icon-container">
                <i className="fa fa-moon-o"></i>
            </div>
            <div className="icon-container">
                <i className="fa fa-envelope"></i>
                <span>5</span>
            </div>
            <div className="icon-container">
                <i className="fa fa-bell"></i>
                <span>3</span>
            </div>
            <div className="profile-container position-relative">
                {user ? (
                    <>
                        <div
                            className="user-account ms-4 me-2 d-flex align-items-center cursor-pointer"
                            onClick={() => toggleDropdown("profile")}
                        >
                            <p className="profile-box me-1">
                                {user.first_name.charAt(0).toUpperCase()}
                            </p>
                            <div>
                                <span className="me-2">Hi, {user.first_name}</span>
                                <i className={`fa ${dropdown === "profile" ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
                            </div>
                        </div>
                        {dropdown === "profile" && (
                            <div className="profile-dropdown position-absolute bg-white shadow-sm rounded py-2">
                                <ul className="list-unstyled mb-0">
                                    <li
                                        className="px-3 py-2 hover-bg cursor-pointer"
                                        onClick={handleViewProfile}
                                    >
                                        <i className="fa fa-user me-2"></i> View Profile
                                    </li>
                                    <li
                                        className="px-3 py-2 hover-bg cursor-pointer"
                                        onClick={logout}
                                    >
                                        <i className="fa fa-sign-out me-2"></i> Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary ms-3">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default TopNav;