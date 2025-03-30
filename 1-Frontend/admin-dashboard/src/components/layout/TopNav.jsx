import Search from "../ui/Search";
import UserIcon from '../../assets/logo_try.jpg';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useEmergencyCount } from "../../context/CountsContext";


const TopNav = () => {
    const { user, logout } = useContext(AuthContext);
    const { emergencyCount } = useEmergencyCount();

    const [dropdown, setDropdown] = useState("");

    const toggleDropdown = (menu) => {
        setDropdown(prevState => prevState === "" ? menu : "");
    }
    return (
        <div className='mini-nav pt-3 mb-2 pb-2 justify-content-end pe-5'>
            <div className="search-bar d-flex">
                <i className="fa fa-search mt-1 me-1 text-secondary"></i>
                <Search />
            </div>
            <div className="nav-ut d-flex">
                <div className="ico-container">
                    <i className='fa fa-moon-o'></i>
                </div>

                <div className="ico-container">         
                    <i className="fa fa-ambulance"></i>
                    <span>{emergencyCount}</span>
                </div>

                <div className="ico-container">
                    <i className='fa fa-envelope'></i>
                    <span>4</span>
                </div>
                
                <div className="ico-container">
                    <i className='fa fa-bell'></i>
                    <span>2</span>
                </div>
                
                <div className="profile-box">
                    <div onClick={() => toggleDropdown("profile")} className="user ms-3">
                        <div id="logo">
                            <img src={UserIcon} alt="User" />
                        </div>
                        <div className="user-identity ms-2">
                            <span>{user ? user.first_name : "Admin"}  {user ? user.last_name : null}<i className={dropdown === "profile" ? 'fa fa-chevron-circle-down ms-3' : 'fa fa-chevron-circle-right ms-3'}></i></span><br/>
                            <span className='text-secondary fs-6'>{user? user.email : null }</span>
                            
                        </div>

                    </div>

                    {dropdown === "profile" && 
                        <div className="profile-dropdown">
                            <ul>
                                <li>View Profile</li>
                                <li onClick={logout}>Logout</li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TopNav