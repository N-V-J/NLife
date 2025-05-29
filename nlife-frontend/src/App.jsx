import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage';
import DoctorsPage from './pages/DoctorsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import PaymentPage from './pages/PaymentPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import AdminPatientsPage from './pages/AdminPatientsPage';
import AdminAddDoctorPage from './pages/AdminAddDoctorPage';
import AdminEditDoctorPage from './pages/AdminEditDoctorPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';
import AdminLoginPage from './pages/admin/LoginPage';

// Auth components
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProtectedRoute from './components/auth/UserProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Admin Login Route - Outside of AdminLayout */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="patients" element={<AdminPatientsPage />} />
              <Route path="doctors" element={<AdminDoctorsPage />} />
              <Route path="add-doctor" element={<AdminAddDoctorPage />} />
              <Route path="edit-doctor/:doctorId" element={<AdminEditDoctorPage />} />
              <Route index element={<AdminDashboardPage />} />
            </Route>

            {/* Client Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="appointments/:doctorId" element={<AppointmentPage />} />
              <Route path="appointments" element={<AppointmentPage />} />
              <Route path="my-appointments" element={
                <UserProtectedRoute>
                  <MyAppointmentsPage />
                </UserProtectedRoute>
              } />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="profile" element={
                <UserProtectedRoute>
                  <ProfilePage />
                </UserProtectedRoute>
              } />
              <Route path="register" element={<SignUpPage />} />
              <Route path="login" element={<LoginPage />} />
              {/* Add more routes as needed */}
            </Route>

            <Route path="*" element={<div className="py-20 text-center">Page not found</div>} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
