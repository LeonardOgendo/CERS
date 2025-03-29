import './App.css';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import Contact from './components/pages/Contact';
import Account from './components/pages/Account';
import Notification from './components/pages/Notification';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import Messages from './components/pages/Messages';
import EmergencyReport from './components/pages/EmergencyReport';
import IncidentHistory from './components/pages/IncidentHistory';
import ProtectedRoute from './components/authentication/ProtectedRoute';

const App = () => {
  return (
    <div>
      <ToastContainer position='top-right' autoClose={4000} hideProgressBar={true} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='account' element={<Account />} />
            <Route path='notification' element={<Notification />} />
            <Route path='messages' element={<Messages />} />
            <Route path='contact' element={<Contact />} />
            <Route path='emergency/report' element={<EmergencyReport />} />
            <Route path='emergency/list' element={<IncidentHistory />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App;