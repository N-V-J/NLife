import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthAxios } from '../services/userService';
import { processImageUrl } from '../utils/imageUtils';

const MyAppointmentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if we have a success message from payment page
    if (location.state && location.state.paymentSuccess) {
      setShowSuccessMessage(true);
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        // Clear the location state
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const user = localStorage.getItem('user');

      console.log('=== AUTHENTICATION CHECK ===');
      console.log('Token found:', !!token);
      console.log('User found:', !!user);

      if (user) {
        const userData = JSON.parse(user);
        console.log('Current user data:', userData);
        console.log('User type:', userData.userType || userData.user_type);
        console.log('User email:', userData.email);
      }

      if (!token) {
        setError('Please log in to view your appointments.');
        setLoading(false);
        return;
      }

      console.log('Fetching user appointments from backend...');

      // Use authenticated axios call to get user's appointments
      const authAxios = getAuthAxios();
      const response = await authAxios.get('appointments/my_appointments/');
      console.log('User appointments response:', response.data);
      console.log('Number of appointments returned:', response.data.length);

      // Process the appointments data - the backend returns appointments with nested doctor and patient data
      const appointmentsData = Array.isArray(response.data) ? response.data : [];
      console.log('Processing appointments:', appointmentsData);

      // Get current user info for verification
      const currentUser = user ? JSON.parse(user) : null;
      const currentUserEmail = currentUser?.email;
      const currentUserType = currentUser?.userType || currentUser?.user_type;

      console.log('Current user for verification:', currentUserEmail, 'Type:', currentUserType);

      // Format the appointments using the backend data structure
      const formattedAppointments = appointmentsData.map(appointment => {
        // Extract doctor information from the nested data
        const doctor = appointment.doctor || {};
        const doctorUser = doctor.user || {};
        const specialty = doctor.specialty || {};

        // Build doctor name
        const doctorName = `${doctorUser.first_name || ''} ${doctorUser.last_name || ''}`.trim() || 'Unknown Doctor';

        // Get specialty name
        const specialtyName = specialty.name || 'Unknown Specialty';

        // Process doctor image
        let doctorImage = '';
        if (doctorUser.profile_picture) {
          doctorImage = processImageUrl(doctorUser.profile_picture);
        }

        // Extract patient information
        const patient = appointment.patient || {};
        const patientUser = patient.user || {};
        const patientName = `${patientUser.first_name || ''} ${patientUser.last_name || ''}`.trim() || 'Unknown Patient';
        const patientEmail = patientUser.email || '';

        // Verification: For patients, ensure this appointment belongs to them
        if (currentUserType === 'patient' && patientEmail !== currentUserEmail) {
          console.warn(`WARNING: Patient appointment mismatch! Current user: ${currentUserEmail}, Appointment patient: ${patientEmail}`);
        }

        // Verification: For doctors, ensure this appointment is assigned to them
        if (currentUserType === 'doctor' && doctorUser.email !== currentUserEmail) {
          console.warn(`WARNING: Doctor appointment mismatch! Current user: ${currentUserEmail}, Appointment doctor: ${doctorUser.email}`);
        }

        console.log(`Processing appointment ${appointment.id}: Patient=${patientEmail}, Doctor=${doctorUser.email}, Current User=${currentUserEmail}`);

        // Format the appointment data
        return {
          id: appointment.id,
          doctor: {
            id: doctor.id || 0,
            name: doctorName,
            specialty: specialtyName,
            image: doctorImage
          },
          patient: {
            id: patient.id || 0,
            name: patientName,
            email: patientEmail
          },
          date: appointment.appointment_date,
          time: appointment.appointment_time,
          status: appointment.status || 'pending',
          paymentStatus: appointment.payment_status || 'unpaid',
          isPaid: appointment.payment_status === 'paid',
          reason: appointment.reason || ''
        };
      });

      console.log('Formatted appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);

      if (err.response?.status === 401) {
        setError('Please log in to view your appointments.');
      } else if (err.response?.status === 404) {
        setError('User profile not found. Please make sure you have a patient profile.');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Failed to load appointments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        // Get authenticated axios instance
        const authAxios = getAuthAxios();

        // Make API call to cancel the appointment
        await authAxios.patch(`appointments/${appointmentId}/`, {
          status: 'cancelled'
        });

        // Update the local state
        setAppointments(appointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        ));

        // Show success message
        alert('Appointment cancelled successfully!');
      } catch (error) {
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };



  return (
    <div style={{
      background: '#f5f7fa',
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>My Appointments</h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '32px'
        }}>
          {(() => {
            const user = localStorage.getItem('user');
            if (user) {
              const userData = JSON.parse(user);
              const userType = userData.userType || userData.user_type || 'user';
              if (userType === 'admin') {
                return 'View and manage all appointments (Admin View)';
              } else if (userType === 'patient') {
                return 'View and manage your upcoming and past appointments';
              } else if (userType === 'doctor') {
                return 'View and manage your patient appointments';
              }
            }
            return 'View and manage your appointments';
          })()}
        </p>

        {showSuccessMessage && (
          <div style={{
            background: '#ECFDF5',
            color: '#059669',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg style={{ width: '24px', height: '24px', marginRight: '12px' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>Appointment Booked Successfully!</p>
              <p style={{ fontSize: '14px' }}>Your appointment has been confirmed and payment was successful.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 16px',
              border: '3px solid #E5E7EB',
              borderTopColor: '#6366F1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6B7280' }}>Loading your appointments...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{ color: '#B91C1C', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={fetchAppointments}
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ color: '#111827', marginBottom: '16px' }}>No Appointments Found</h2>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>You don't have any appointments scheduled yet.</p>
            <button
              onClick={() => navigate('/doctors')}
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {appointments.map(appointment => {
              const statusColors = {
                pending: { bg: '#FEF3C7', text: '#D97706' },
                confirmed: { bg: '#ECFDF5', text: '#059669' },
                completed: { bg: '#EFF6FF', text: '#3B82F6' },
                cancelled: { bg: '#FEF2F2', text: '#B91C1C' }
              };

              const statusColor = statusColors[appointment.status.toLowerCase()] || { bg: '#F3F4F6', text: '#4B5563' };

              return (
                <div key={appointment.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px',
                    '@media(minWidth: 768px)': {
                      flexDirection: 'row'
                    }
                  }}>
                    {/* Doctor Image */}
                    <div style={{
                      marginRight: '24px',
                      marginBottom: '16px',
                      '@media(minWidth: 768px)': {
                        marginBottom: '0'
                      }
                    }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden'
                      }}>
                        {appointment.doctor.image ? (
                          <img
                            src={appointment.doctor.image}
                            alt={appointment.doctor.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              // If image fails to load, show the first letter of the doctor's name
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = `<div style="
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 36px;
                                font-weight: 600;
                              ">${appointment.doctor.name.charAt(0)}</div>`;
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '36px',
                            fontWeight: '600'
                          }}>
                            {appointment.doctor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                        flexDirection: 'column',
                        '@media(minWidth: 768px)': {
                          flexDirection: 'row'
                        }
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '4px'
                          }}>{appointment.doctor.name}</h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#6B7280'
                          }}>{appointment.doctor.specialty}</p>
                        </div>
                        <div style={{
                          background: statusColor.bg,
                          color: statusColor.text,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginTop: '8px',
                          '@media(minWidth: 768px)': {
                            marginTop: '0'
                          }
                        }}>
                          {appointment.status}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginTop: '16px'
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Date</p>
                          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                            {appointment.date}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Time</p>
                          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                            {appointment.time}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Payment</p>
                          <p style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: appointment.isPaid ? '#059669' : '#D97706',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {appointment.isPaid ? (
                              <>
                                <span style={{
                                  display: 'inline-block',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: '#ECFDF5',
                                  marginRight: '6px',
                                  position: 'relative'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#059669'
                                  }}></span>
                                </span>
                                Paid
                              </>
                            ) : (
                              <>
                                <span style={{
                                  display: 'inline-block',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: '#FEF3C7',
                                  marginRight: '6px',
                                  position: 'relative'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#D97706'
                                  }}></span>
                                </span>
                                {appointment.paymentStatus === 'unpaid' ? 'Unpaid' : appointment.paymentStatus}
                              </>
                            )}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Patient</p>
                          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                            {appointment.patient?.name || 'Unknown Patient'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '20px',
                        flexDirection: 'column',
                        '@media(minWidth: 768px)': {
                          flexDirection: 'row'
                        }
                      }}>
                        {appointment.status.toLowerCase() !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            style={{
                              padding: '10px 16px',
                              background: 'white',
                              color: '#4B5563',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              width: '100%',
                              '@media(minWidth: 768px)': {
                                width: 'auto'
                              }
                            }}
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
