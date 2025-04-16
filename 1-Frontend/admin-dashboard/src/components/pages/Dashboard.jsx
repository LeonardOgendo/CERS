import useRole from "../../hooks/useRole";
import { useCount } from "../../context/CountsContext";
import { useNavigate } from "react-router-dom";
import CountsFetcher from "../ui/CountsFetcher";

const Dashboard = () => {
    const role = useRole();
    const { resolvedEmergenciesCount, totalEmergencyReports, totalResponders, totalUsers } = useCount();
    const navigate = useNavigate();

    return(
        <>
            <CountsFetcher />
            <div className='header p-2 rounded'>
                <span className='fw-bold'>Analytics</span>
            </div>

            {role === 'admin' ? (
                <div className="dash-container admin">
                    <div className='box-1'>
                        <div id="t-users" className='border p-3 rounded' onClick={() => navigate('analytics/users/all-users')}>
                            <h5>Total Users</h5>
                            <p className='fw-bold fs-4'>{totalUsers}</p>
                        </div>
                        <div id="t-emeg" className='border p-3 rounded' onClick={() => navigate('analytics/emergencies/all')}>
                            <h5>Total Emergency Reports</h5>
                            <p className='fw-bold fs-4'>{totalEmergencyReports}</p>
                        </div>
                        <div id="m-flagd" className='border p-3 rounded'>
                            <h5>Most Flagged Areas</h5>
                            <p className="fw-bold fs-4">3</p>
                        </div>

                        <div id="t-resn" className='border p-3 rounded' onClick={() => navigate('responders/view')}>
                            <h5>Total Responders</h5>
                            <p className="fw-bold fs-4">{totalResponders}</p>
                        </div>

                    </div>
                    <div className="box-2">
                        <div id="r-emeg" className='border p-3 rounded' onClick={() => navigate('emergencies/resolved')}>
                            <h5>Resolved Emergencies</h5>
                            <p className='fw-bold fs-4'>{resolvedEmergenciesCount}</p>
                        </div>
                    </div>
            </div>
            ): (
                <div className="dash-container responder">
                    <div className='border p-3 rounded custom-box-1'>
                        <h5 className="mt-2">Total Emergency Reports</h5>
                        <p className='fw-bold fs-4'>530</p>
                    </div>
                    <div className='border p-3 rounded custom-box-2'>
                        <h5 className="mt-2">Most Flagged Areas</h5>
                        <p className="fw-bold fs-4">3</p>
                    </div>
                    <div className='border p-3 rounded custom-box-3'>
                        <h5 className="mt-2">Resolved Emergencies</h5>
                        <p className='fw-bold fs-4'>503</p>
                    </div>
                </div>
            )}
            <div className='header p-2 mt-5'>
                <span className='fw-bold'>Most Student Occupancy Areas</span>
            </div>

            <div className="occ-area-map mt-1 mb-3">
                <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31918.130563746294!2d34.72617621083985!3d0.29252480000002135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17803c2381e6b747%3A0xd788ea540e29f427!2sMasinde%20Muliro%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2ske!4v1740366870825!5m2!1sen!2ske"
                        width="100%"
                        height="400px"
                        style={{ 'border': '0'}}
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="overlay"></div>
            </div>

            <div className="occupied-areas">
                <div className="py-4 px-3 rounded">
                    <span className='name-label'>Name : </span><span className='area-name'>Lurambi</span><br></br>
                    <span className='name-label'>Population : </span><span className='text-white fw-bold ms-1 pop-number'>3,000</span>
                </div>
                <div className="py-4 px-3 rounded">
                    <span className='name-label'>Name : </span><span className='area-name'>Sichirayi</span><br></br>
                    <span className='name-label'>Population : </span><span className='text-white fw-bold ms-1 pop-number'>5,000</span>
                </div>
                <div className="py-4 px-3 rounded">
                    <span className='name-label'>Name : </span><span className='area-name'>Koromatangi</span><br></br>
                    <span className='name-label'>Population : </span><span className='text-white fw-bold ms-1 pop-number'>5,000</span>
                </div>
                <div className="py-4 px-3 rounded">
                    <span className='name-label'>Name : </span><span className='area-name'>Kefinco</span><br></br>
                    <span className='name-label'>Population : </span><span className='text-white fw-bold ms-1 pop-number'>3, 260</span>
                </div>
            </div>
        </>

    )
}

export default Dashboard