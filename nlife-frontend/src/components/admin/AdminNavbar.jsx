import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  
  // Check if the current path is an admin path
  const isAdminPath = location.pathname.startsWith('/admin');
  
  // Only show the admin navbar on admin pages
  if (!isAdminPath) return null;
  
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '12px 20px',
      marginBottom: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '24px'
      }}>
        <Link 
          to="/admin/appointments"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: location.pathname === '/admin/appointments' ? '#6366F1' : '#4B5563',
            background: location.pathname === '/admin/appointments' ? '#EEF2FF' : 'transparent',
            textDecoration: 'none'
          }}
        >
          Appointments
        </Link>
        
        <Link 
          to="/admin/patients"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: location.pathname === '/admin/patients' ? '#6366F1' : '#4B5563',
            background: location.pathname === '/admin/patients' ? '#EEF2FF' : 'transparent',
            textDecoration: 'none'
          }}
        >
          Patients
        </Link>
      </div>
    </div>
  );
};

export default AdminNavbar;
