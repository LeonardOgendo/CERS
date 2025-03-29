import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Account = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        phone_number: '',
        date_of_birth: '',
        location: '',
        address: '',
        profile_picture: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/users/profile/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setFormData({
                phone_number: data.phone_number || '',
                date_of_birth: data.date_of_birth || '',
                location: data.location || '',
                address: data.address || '',
                profile_picture: null
            });

            if (data.profile_picture) {
                setPreviewImage(data.profile_picture);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [navigate, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profile_picture: file
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('phone_number', formData.phone_number);
            formDataToSend.append('date_of_birth', formData.date_of_birth);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('address', formData.address);

            if (formData.profile_picture) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }

            const response = await fetch('http://localhost:8000/api/users/profile/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedProfile = await response.json();

            // Update the preview image with the new URL from backend
            if (updatedProfile.profile_picture) {
                setPreviewImage(updatedProfile.profile_picture);
            }

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
            // Re-fetch the profile to restore previous state
            fetchProfile();
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile"
                                    className="rounded-circle mb-3 img-thumbnail"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&size=150`;
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-primary mb-3 mx-auto d-flex align-items-center justify-content-center"
                                    style={{ width: '150px', height: '150px' }}
                                >
                                    <span className="text-white display-4">
                                        {user?.first_name?.charAt(0).toUpperCase()}
                                        {user?.last_name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <h4 className="mb-1">{user?.first_name} {user?.last_name}</h4>
                            <p className="text-muted mb-4">{user?.email}</p>

                            <div className="mb-3">
                                <label className="btn btn-primary btn-sm">
                                    <i className="fa fa-camera me-1"></i> Change Photo
                                    <input
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Profile Settings</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user?.first_name || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user?.last_name || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={user?.email || ''}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Residential Area</label>
                                    <select
                                        className="form-select"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Residential Area</option>
                                        <option value="Lurambi">Lurambi</option>
                                        <option value="Koromatangi">Koromatangi</option>
                                        <option value="Mwiyala">Mwiyala</option>
                                        <option value="Teazone">Teazone</option>
                                        <option value="Kefinco">Kefinco</option>
                                        <option value="Sichirai">Sichirai</option>
                                        <option value="Mulunyu">Mulunyu</option>
                                        <option value="Laposada">Laposada</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your full address"
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary px-4">
                                        <i className="fa fa-save me-2"></i> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;