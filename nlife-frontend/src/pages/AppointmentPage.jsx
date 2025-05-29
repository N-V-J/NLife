import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to generate available days based on current date
const generateAvailableDays = (availableDaysString) => {
  const daysMap = {
    'monday': 'MON',
    'tuesday': 'TUE',
    'wednesday': 'WED',
    'thursday': 'THU',
    'friday': 'FRI',
    'saturday': 'SAT',
    'sunday': 'SUN'
  };

  // Parse available days from the doctor's data
  let availableDaysArray = [];
  if (availableDaysString) {
    availableDaysArray = availableDaysString.toLowerCase().split(',').map(day => day.trim());
  }

  // If no available days specified, default to weekdays
  if (availableDaysArray.length === 0) {
    availableDaysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  }

  // Get current date
  const today = new Date();
  const result = [];

  // Generate next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayShort = daysMap[dayName] || dayName.substring(0, 3).toUpperCase();
    const dateNum = date.getDate();

    result.push({
      day: dayShort,
      date: dateNum.toString(),
      fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD format
      available: availableDaysArray.includes(dayName)
    });
  }

  return result;
};

// Helper function to generate time slots based on doctor's schedule
const generateTimeSlots = (startTime, endTime) => {
  console.log('Generating time slots with:', { startTime, endTime });

  // Default time slots if no specific times are provided
  if (!startTime || !endTime) {
    console.log('Using default time slots');
    return [
      { time: '9:00 am', available: true },
      { time: '10:00 am', available: true },
      { time: '11:00 am', available: true },
      { time: '12:00 pm', available: true },
      { time: '2:00 pm', available: true },
      { time: '3:00 pm', available: true },
      { time: '4:00 pm', available: true },
      { time: '5:00 pm', available: true },
    ];
  }

  try {
    // Parse start and end times
    const parseTime = (timeStr) => {
      // Handle different time formats
      if (!timeStr) return 0;

      // If it's already in HH:MM:SS format
      if (timeStr.split(':').length === 3) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes; // Convert to minutes
      }

      // If it's in HH:MM format
      if (timeStr.split(':').length === 2) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes; // Convert to minutes
      }

      // Default fallback
      return 9 * 60; // 9:00 AM in minutes
    };

    const formatTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    console.log('Parsed time range:', {
      startMinutes,
      endMinutes,
      startFormatted: formatTime(startMinutes),
      endFormatted: formatTime(endMinutes)
    });

    // Generate time slots with 30-minute intervals for more options
    const slots = [];
    const interval = 30; // 30 minutes

    // Make sure we have a valid time range
    if (startMinutes >= endMinutes) {
      console.log('Invalid time range, using default slots');
      return [
        { time: '9:00 am', available: true },
        { time: '10:00 am', available: true },
        { time: '11:00 am', available: true },
        { time: '12:00 pm', available: true },
        { time: '2:00 pm', available: true },
        { time: '3:00 pm', available: true },
        { time: '4:00 pm', available: true },
        { time: '5:00 pm', available: true },
      ];
    }

    for (let time = startMinutes; time < endMinutes; time += interval) {
      // Skip lunch hour (1:00 PM - 2:00 PM) as a common practice
      if (time >= 13 * 60 && time < 14 * 60) {
        continue;
      }

      slots.push({
        time: formatTime(time),
        available: true
      });
    }

    console.log('Generated time slots:', slots);
    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    // Return default time slots in case of error
    return [
      { time: '9:00 am', available: true },
      { time: '10:00 am', available: true },
      { time: '11:00 am', available: true },
      { time: '12:00 pm', available: true },
      { time: '2:00 pm', available: true },
      { time: '3:00 pm', available: true },
      { time: '4:00 pm', available: true },
      { time: '5:00 pm', available: true },
    ];
  }
};

// Default related doctors in case API fails
const defaultRelatedDoctors = [
  {
    id: 1,
    name: 'Dr. John Smith',
    specialty: 'General Physician',
    rating: 4.9,
    image: '',
    path: '/appointments/1',
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    image: '',
    path: '/appointments/2',
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    specialty: 'Neurologist',
    rating: 4.7,
    image: '',
    path: '/appointments/3',
  }
];



// Helper function to process image URLs
const processImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/static')) return url;
  return `https://nlife-backend-debug.onrender.com${url}`;
};

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [doctor, setDoctor] = useState({
    id: 0,
    name: '',
    specialty: '',
    verified: false,
    rating: 0,
    about: '',
    appointmentFee: '₹500',
    image: '',
    education: '',
    experience_years: 0,
    consultation_fee: 0,
    available_days: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    fetchDoctorData();
    fetchRelatedDoctors();
  }, [doctorId]);

  // Update available days when doctor data changes
  useEffect(() => {
    if (!loading) {
      // Generate available days based on doctor's schedule
      const days = generateAvailableDays(doctor.available_days);
      setAvailableDays(days);

      // Set the first available day as selected
      const firstAvailableDay = days.find(day => day.available);
      if (firstAvailableDay) {
        setSelectedDay(firstAvailableDay);
      }
    }
  }, [loading, doctor]);

  // Update time slots when selected day changes
  useEffect(() => {
    if (selectedDay) {
      console.log('Selected day changed, updating time slots:', selectedDay);

      // Reset selected time when day changes
      setSelectedTime(null);

      // Generate time slots based on doctor's schedule and selected day
      const slots = generateTimeSlots(doctor.start_time, doctor.end_time);

      // If it's a weekend, reduce available slots (as an example of day-specific slots)
      const isWeekend = selectedDay.day === 'SAT' || selectedDay.day === 'SUN';

      if (isWeekend) {
        // On weekends, only morning slots might be available
        const morningSlots = slots.filter(slot => {
          const hourMatch = slot.time.match(/(\d+):(\d+)\s*(am|pm)/i);
          if (hourMatch) {
            const hour = parseInt(hourMatch[1]);
            const period = hourMatch[3].toLowerCase();

            // Only include slots before 1pm
            return period === 'am' || (period === 'pm' && hour === 12);
          }
          return false;
        });

        setAvailableTimeSlots(morningSlots);
      } else {
        // For weekdays, use all slots
        setAvailableTimeSlots(slots);
      }
    }
  }, [selectedDay, doctor.start_time, doctor.end_time]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://nlife-backend-debug.onrender.com/api/doctors/${doctorId}/`);
      console.log('Doctor data:', response.data);

      // Format the doctor data
      const doctorData = response.data;
      console.log('Doctor image URL:', doctorData.user?.profile_picture);

      // Process the image URL
      const imageUrl = processImageUrl(doctorData.user?.profile_picture);
      console.log('Processed image URL:', imageUrl);

      setDoctor({
        id: doctorData.id,
        name: `${doctorData.user?.first_name || ''} ${doctorData.user?.last_name || ''}`.trim() || 'Unknown Doctor',
        specialty: doctorData.specialty?.name || 'Unknown',
        verified: true,
        rating: doctorData.rating || 0,
        about: doctorData.bio || 'No bio available',
        appointmentFee: `₹${doctorData.consultation_fee || 500}`,
        image: imageUrl,
        education: doctorData.education || '',
        experience_years: doctorData.experience_years || 0,
        consultation_fee: doctorData.consultation_fee || 0,
        available_days: doctorData.available_days || '',
        start_time: doctorData.start_time || '',
        end_time: doctorData.end_time || ''
      });
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      // Set default data in case of error
      setDoctor({
        id: parseInt(doctorId),
        name: 'Doctor',
        specialty: 'Specialist',
        verified: false,
        rating: 0,
        about: 'Information not available',
        appointmentFee: '₹500',
        image: '',
        education: '',
        experience_years: 0,
        consultation_fee: 0,
        available_days: '',
        start_time: '',
        end_time: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/doctors/');
      console.log('Related doctors data:', response.data);

      // Process the data
      let doctorsData = [];
      if (Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.results)) {
          doctorsData = response.data.results;
        }
      }

      // Format the doctors and filter out the current doctor
      const formattedDoctors = doctorsData
        .filter(doc => doc.id !== parseInt(doctorId))
        .slice(0, 5) // Limit to 5 doctors
        .map(doc => ({
          id: doc.id,
          name: `${doc.user?.first_name || ''} ${doc.user?.last_name || ''}`.trim() || 'Unknown Doctor',
          specialty: doc.specialty?.name || 'Unknown',
          rating: doc.rating || 0,
          image: processImageUrl(doc.user?.profile_picture),
          path: `/appointments/${doc.id}`
        }));

      setRelatedDoctors(formattedDoctors.length > 0 ? formattedDoctors : defaultRelatedDoctors);
    } catch (error) {
      console.error('Error fetching related doctors:', error);
      setRelatedDoctors(defaultRelatedDoctors);
    }
  };

  const handleBookAppointment = () => {
    if (selectedDay && selectedTime) {
      console.log('Booking appointment with details:', {
        doctor: doctor,
        day: selectedDay,
        time: selectedTime
      });

      // Navigate to payment page with appointment details
      navigate('/payment', {
        state: {
          appointmentDetails: {
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            date: `${selectedDay.day} ${selectedDay.date}`,
            fullDate: selectedDay.fullDate, // Include the full date in YYYY-MM-DD format
            time: selectedTime.time,
            fee: doctor.appointmentFee
          }
        }
      });
    } else {
      alert('Please select both a day and time for your appointment');
    }
  };

  return (
    <div style={{
      background: '#f5f7fa',
      minHeight: 'calc(100vh - 64px)', // Adjust for header height
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {loading ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              fontSize: '18px',
              color: '#6B7280',
              marginBottom: '16px'
            }}>Loading doctor information...</div>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto',
              border: '3px solid #E5E7EB',
              borderTopColor: '#6366F1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
        {/* Doctor Profile Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              '@media(minWidth: 768px)': {
                flexDirection: 'row'
              }
            }}>
              {/* Doctor Image */}
              <div style={{
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto',
                '@media(minWidth: 768px)': {
                  margin: '0'
                }
              }}>
                <div style={{
                  height: '300px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      style={{
                        height: '180px',
                        width: '180px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  ) : (
                    <div style={{
                      height: '180px',
                      width: '180px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      color: '#9CA3AF',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      {doctor.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div style={{
                flex: '1'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#111827',
                    marginRight: '12px'
                  }}>{doctor.name}</h1>
                  {doctor.verified && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#EEF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: '#6366F1' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  marginBottom: '16px'
                }}>{doctor.specialty}</p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#ECFDF5',
                  color: '#059669',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  marginBottom: '24px'
                }}>
                  <span style={{ marginRight: '4px' }}>★</span> {doctor.rating}
                </div>

                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px'
                }}>About Doctor</h2>
                <p style={{
                  fontSize: '15px',
                  color: '#4B5563',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>{doctor.about}</p>

                <div style={{
                  background: '#F3F4F6',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>Appointment Fee: <span style={{ color: '#6366F1' }}>{doctor.appointmentFee}</span></h2>
                </div>

                {/* Doctor Schedule Information */}
                <div style={{
                  background: '#F3F4F6',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '12px'
                  }}>Doctor's Schedule</h2>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: '#6366F1', marginRight: '8px' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                      </svg>
                      <span style={{ fontSize: '14px', color: '#4B5563' }}>
                        Available Days: <span style={{ fontWeight: '600', color: '#111827' }}>{doctor.available_days || 'Weekdays (Mon-Fri)'}</span>
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: '#6366F1', marginRight: '8px' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                      <span style={{ fontSize: '14px', color: '#4B5563' }}>
                        Hours: <span style={{ fontWeight: '600', color: '#111827' }}>
                          {doctor.start_time && doctor.end_time
                            ? `${doctor.start_time.split(':').slice(0, 2).join(':')} - ${doctor.end_time.split(':').slice(0, 2).join(':')}`
                            : '9:00 AM - 5:00 PM'}
                        </span>
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: '#6366F1', marginRight: '8px' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span style={{ fontSize: '14px', color: '#4B5563' }}>
                        Experience: <span style={{ fontWeight: '600', color: '#111827' }}>{doctor.experience_years} years</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '24px'
          }}>Select Appointment Time</h2>

          {/* Days Selection */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }}>
            {availableDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day.available && setSelectedDay(day)}
                disabled={!day.available}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 8px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: selectedDay === day ? 'transparent' : day.available ? '#E5E7EB' : '#F3F4F6',
                  background: selectedDay === day
                    ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                    : day.available ? 'white' : '#F9FAFB',
                  color: selectedDay === day
                    ? 'white'
                    : day.available ? '#111827' : '#9CA3AF',
                  cursor: day.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: selectedDay === day ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>{day.day}</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '700'
                }}>{day.date}</span>
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>Available Time Slots</h3>

          {availableTimeSlots.length === 0 ? (
            <div style={{
              background: '#F9FAFB',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <p style={{ color: '#6B7280', marginBottom: '8px' }}>No time slots available for this day</p>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Please select another day or contact the clinic</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '16px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#10B981',
                    marginRight: '6px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Available</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#6366F1',
                    marginRight: '6px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Selected</span>
                </div>
              </div>

              <div className="responsive-grid responsive-grid-4" style={{
                marginBottom: '32px'
              }}>
                {availableTimeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: '12px 8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: selectedTime === slot ? 'transparent' : '#E5E7EB',
                      background: selectedTime === slot
                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        : 'white',
                      color: selectedTime === slot ? 'white' : '#4B5563',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedTime === slot ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {slot.time}
                    {slot.available && !selectedTime === slot && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10B981'
                      }}></div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Book Appointment Button */}
          <button
              onClick={handleBookAppointment}
              disabled={!selectedTime}
              style={{
                width: '100%',
                padding: '16px',
                background: selectedTime
                  ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                  : '#E5E7EB',
                color: selectedTime ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: selectedTime ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: selectedTime ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
              }}
            >
              {selectedTime
                ? `Book appointment for ${selectedTime.time}`
                : 'Select a time slot to book'}
            </button>
        </div>

        {/* Related Doctors Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px'
          }}>Related Doctors</h2>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            marginBottom: '24px'
          }}>Trusted, experienced professionals to provide the care you deserve</p>

          <div className="responsive-grid responsive-grid-3">
            {relatedDoctors.map((doctor) => (
              <div key={doctor.id} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                border: '1px solid #F3F4F6'
              }}>
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      style={{
                        height: '100px',
                        width: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  ) : (
                    <div style={{
                      height: '100px',
                      width: '100px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      color: '#9CA3AF',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      {doctor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      background: '#ECFDF5',
                      color: '#059669',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      ★ {doctor.rating}
                    </div>
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>{doctor.name}</h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    marginBottom: '12px'
                  }}>{doctor.specialty}</p>
                  <Link to={doctor.path} style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    background: 'white',
                    color: '#6366F1',
                    border: '1px solid #6366F1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}>
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
