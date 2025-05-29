import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, getCurrentUser, getPatientProfile, getAuthAxios } from '../services/userService';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    // Get appointment details from location state
    if (location.state && location.state.appointmentDetails) {
      setAppointmentDetails(location.state.appointmentDetails);
    } else {
      // If no appointment details, redirect back to appointments
      navigate('/doctors');
    }
  }, [location, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateCardDetails = () => {
    if (cardNumber.length < 16) {
      setError('Please enter a valid card number');
      return false;
    }
    if (cardName.trim() === '') {
      setError('Please enter the name on card');
      return false;
    }
    if (expiryDate.trim() === '') {
      setError('Please enter the expiry date');
      return false;
    }
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const validateUpiDetails = () => {
    if (upiId.trim() === '') {
      setError('Please enter a valid UPI ID');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setError('');

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('You need to be logged in to book an appointment');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Validate based on payment method
    let isValid = false;
    if (paymentMethod === 'card') {
      isValid = validateCardDetails();
    } else if (paymentMethod === 'upi') {
      isValid = validateUpiDetails();
    }

    if (!isValid) return;

    setLoading(true);
    try {
      // In a real application, you would integrate with a payment gateway here
      // For now, we'll simulate a payment process

      // Get current user
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.id) {
        setError('User information not found. Please log in again.');
        setTimeout(() => {
          navigate('/login', { state: { from: location.pathname } });
        }, 2000);
        return;
      }

      // First, we need to get the patient ID for the current user
      try {
        // Get the patient profile for the current user
        const patientProfile = await getPatientProfile();
        console.log('Patient profile:', patientProfile);

        // Get the patient ID
        const patientId = patientProfile?.id;

        if (!patientId) {
          setError('Patient profile not found. Please contact support.');
          setLoading(false);
          return;
        }

        // Log the appointment details for debugging
        console.log('Appointment details:', appointmentDetails);

        // Use the fullDate if available, otherwise format from the date string
        let formattedDate;

        if (appointmentDetails.fullDate) {
          // Use the fullDate directly if available (already in YYYY-MM-DD format)
          formattedDate = appointmentDetails.fullDate;
          console.log('Using fullDate from appointment details:', formattedDate);
        } else {
          // Fallback to the old method if fullDate is not available
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
          const currentYear = currentDate.getFullYear();

          // Extract day number from the date string (e.g., "MON 15" -> "15")
          let dayNumber = '01';
          if (appointmentDetails.date) {
            const dateParts = appointmentDetails.date.split(' ');
            if (dateParts.length > 1) {
              dayNumber = dateParts[1];
            }
          }

          // Ensure dayNumber is a string before using padStart
          const dayStr = String(dayNumber);
          const monthStr = String(currentMonth);

          console.log('Day number:', dayNumber);

          // Format the date as YYYY-MM-DD
          formattedDate = `${currentYear}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}`;
          console.log('Formatted date from parts:', formattedDate);
        }

        // Format the time (convert from "8:00 am" to "08:00:00")
        let formattedTime = '09:00:00'; // Default fallback time

        if (appointmentDetails.time) {
          console.log('Original time string:', appointmentDetails.time);

          try {
            // Parse the time string
            const timeMatch = appointmentDetails.time.match(/(\d+):(\d+)\s*(am|pm)/i);
            if (timeMatch) {
              let hours = parseInt(timeMatch[1]);
              const minutes = timeMatch[2];
              const period = timeMatch[3].toLowerCase();

              console.log('Parsed time parts:', { hours, minutes, period });

              // Convert to 24-hour format
              if (period === 'pm' && hours < 12) {
                hours += 12;
              } else if (period === 'am' && hours === 12) {
                hours = 0;
              }

              // Format as HH:MM:00
              formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:00`;
            } else {
              console.log('Time string did not match expected format, using default');
            }
          } catch (timeError) {
            console.error('Error parsing time:', timeError);
          }
        } else {
          console.log('No time provided, using default');
        }

        console.log('Formatted date:', formattedDate);
        console.log('Formatted time:', formattedTime);

        // Create appointment in the backend
        const appointmentData = {
          doctor: appointmentDetails.doctorId,
          patient: patientId,
          appointment_date: formattedDate,
          appointment_time: formattedTime,
          reason: 'Consultation'
        };

        console.log('Sending appointment data:', appointmentData);

        // Get authenticated axios instance
        const authAxios = getAuthAxios();

        // Make the API request
        let appointmentResponse;
        try {
          appointmentResponse = await authAxios.post('appointments/', appointmentData);
          console.log('Appointment created:', appointmentResponse.data);
        } catch (apiError) {
          console.error('API Error:', apiError);
          if (apiError.response) {
            console.error('Error response data:', apiError.response.data);
            console.error('Error response status:', apiError.response.status);
            throw apiError;
          }
          throw apiError;
        }

        // Simulate payment processing delay
        setTimeout(() => {
          setLoading(false);
          // Navigate to success page or my appointments page
          navigate('/my-appointments', {
            state: {
              paymentSuccess: true,
              appointmentId: appointmentResponse.data.id
            }
          });
        }, 2000);
      } catch (innerError) {
        console.error('Error getting patient profile or creating appointment:', innerError);
        setLoading(false);

        if (innerError.response && innerError.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          setTimeout(() => {
            navigate('/login', { state: { from: location.pathname } });
          }, 2000);
        } else if (innerError.response && innerError.response.data && innerError.response.data.detail) {
          setError(innerError.response.data.detail);
        } else {
          setError('Failed to create appointment. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          setTimeout(() => {
            navigate('/login', { state: { from: location.pathname } });
          }, 2000);
        } else if (error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
        } else {
          setError('Payment failed. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Payment failed. Please try again.');
      }
    }
  };

  if (!appointmentDetails) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        background: '#f5f7fa'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#111827', marginBottom: '16px' }}>No appointment details found</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>Please select a doctor and book an appointment first.</p>
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
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f5f7fa',
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '32px',
          textAlign: 'center'
        }}>Complete Your Payment</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Appointment Summary */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>Appointment Summary</h2>

            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '4px' }}>Doctor</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{appointmentDetails.doctorName}</p>
            </div>

            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '4px' }}>Specialty</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{appointmentDetails.specialty}</p>
            </div>

            <div style={{
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '4px' }}>Date & Time</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {appointmentDetails.date}, {appointmentDetails.time}
              </p>
            </div>

            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Consultation Fee</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#6366F1' }}>{appointmentDetails.fee}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '24px'
            }}>Payment Method</h2>

            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => handlePaymentMethodChange('card')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid',
                  borderColor: paymentMethod === 'card' ? '#6366F1' : '#E5E7EB',
                  borderRadius: '8px',
                  background: paymentMethod === 'card' ? '#EEF2FF' : 'white',
                  color: paymentMethod === 'card' ? '#6366F1' : '#4B5563',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Credit/Debit Card
              </button>
              <button
                onClick={() => handlePaymentMethodChange('upi')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid',
                  borderColor: paymentMethod === 'upi' ? '#6366F1' : '#E5E7EB',
                  borderRadius: '8px',
                  background: paymentMethod === 'upi' ? '#EEF2FF' : 'white',
                  color: paymentMethod === 'upi' ? '#6366F1' : '#4B5563',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                UPI
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '6px' }}>
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
            )}

            {error && (
              <div style={{
                background: '#FEF2F2',
                color: '#B91C1C',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#E5E7EB' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: loading ? '#9CA3AF' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #E5E7EB',
                    borderTopColor: '#9CA3AF',
                    borderRadius: '50%',
                    marginRight: '8px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Processing...
                </>
              ) : (
                `Pay ${appointmentDetails.fee}`
              )}
            </button>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
