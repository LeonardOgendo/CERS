import './App.css';
import './styles.css';

import { ToastContainer } from 'react-toastify';
import {Routes, Route } from 'react-router-dom';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import Dashboard from './components/pages/Dashboard';
import Layout from './components/layout/Layout';
import ActiveEmergencies from './components/pages/ActiveEmergencies';
import ResolvedEmergencies from './components/pages/ResolvedEmergencies';
import ViewResponders from './components/pages/ViewResponders';
import AssignResponders from './components/pages/AssignResponders';
import ApproveAccounts from './components/pages/ApproveAccounts';
import RemoveAccounts from './components/pages/RemoveAccounts';
import FlaggedAreas from './components/pages/FlaggedAreas';
import FlagArea from './components/pages/FlagArea';
import Notifications from './components/pages/Notifications';
import Messages from './components/pages/Messages';
import ResponderAssignmentDetail from './components/pages/ResponderAssignmentDetail';
import ResponderDetail from './components/pages/ResponderDetail';

import ProtectedRoute from './components/authentication/ProtectedRoute';

const App = () => {
    
    return(
        <div>
            <ToastContainer position='top-right' autoClose={4000} hideProgressBar={true}  />
            
            <Routes>
                {/* -- Public Routes --*/}
                <Route path="/" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/*-- Protected Routes --*/}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="emergencies/active" element={<ActiveEmergencies />} />
                        <Route path="emergencies/resolved" element={<ResolvedEmergencies />} />
                        <Route path="responders/view" element={<ViewResponders />} />
                        <Route path='responders/view/responder/detailview/:id' element={<ResponderDetail />} />
                        <Route path="responders/assign" element={<AssignResponders />} />
                        <Route path="responders/assign/responder/:id" element={<ResponderAssignmentDetail />} />
                        <Route path="users/approve" element={<ApproveAccounts />} />
                        <Route path="users/remove" element={<RemoveAccounts />} />
                        <Route path="flagged-areas" element={<FlaggedAreas />} />
                        <Route path="flag-area" element={<FlagArea />} />
                        <Route path="notifications/view" element={<Notifications />} />
                        <Route path="messages" element={<Messages />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    )
}

export default App