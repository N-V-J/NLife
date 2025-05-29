import { useState, useEffect } from 'react';
import axios from 'axios';
import SpecialtyFilterButton from '../components/specialties/SpecialtyFilterButton';

// Hardcoded production backend URL
const PRODUCTION_BACKEND = 'https://nlife-backend-debug.onrender.com';

// Default specialties in case API fails
const defaultSpecialties = [
  { id: 1, name: 'General Physician' },
  { id: 2, name: 'Dermatologist' },
  { id: 3, name: 'Pediatrician' },
  { id: 4, name: 'Neurologist' },
  { id: 5, name: 'Cardiologist' },
  { id: 6, name: 'Orthopedic' },
];

const DoctorsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [realSpecialties, setRealSpecialties] = useState([]);
  const [error, setError] = useState(null);

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${PRODUCTION_BACKEND}/api/doctors/`);
      console.log('API Response:', response.data);

      // Transform the data to match our component's expected format
      const formattedDoctors = processApiDoctors(response.data);
      setDoctors(formattedDoctors);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(`${PRODUCTION_BACKEND}/api/specialties/`);
      console.log('Specialties API Response:', response.data);

      // Process specialties data
      let specialtiesData = [];
      if (Array.isArray(response.data)) {
        specialtiesData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.results)) {
          specialtiesData = response.data.results;
        }
      }

      setRealSpecialties(specialtiesData);
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  // Process API response to format doctors data
  const processApiDoctors = (data) => {
    let doctorsData = [];

    // Handle different API response formats
    if (Array.isArray(data)) {
      doctorsData = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.results)) {
        doctorsData = data.results;
      }
    }

    // Transform the data
    return doctorsData.map(doctor => ({
      id: doctor.id,
      name: `${doctor.user?.first_name || ''} ${doctor.user?.last_name || ''}`.trim() || 'Unknown Doctor',
      specialty: doctor.specialty?.name || 'Unknown',
      rating: doctor.rating || 0,
      available: doctor.is_available || false,
      is_featured: doctor.is_featured || false,
      user: doctor.user,
      education: doctor.education || '',
      consultation_fee: doctor.consultation_fee || 0,
      available_days: doctor.available_days || '',
      start_time: doctor.start_time || null,
      end_time: doctor.end_time || null,
      bio: doctor.bio || ''
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter doctors based on selected specialty and search term
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty === '' ||
      doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    const matchesSearch = searchTerm === '' ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.education && doctor.education.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSpecialty && matchesSearch;
  });

  return (
    <div style={{
      background: '#f5f7fa',
      minHeight: 'calc(100vh - 64px)', // Adjust for header height
    }} className="responsive-padding">
      <div className="responsive-container">
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px'
          }}>Find Your Perfect Doctor</h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Browse through our complete network of highly qualified healthcare professionals and book your appointment today
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 1fr) 3fr',
          gap: '24px'
        }}>
          {/* Sidebar with filters */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '20px'
              }}>Find by Specialty</h2>

              {/* Search input */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              {/* Specialty filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SpecialtyFilterButton
                  specialty="All Specialties"
                  isSelected={selectedSpecialty === ''}
                  onClick={() => handleSpecialtyChange('')}
                />

                {realSpecialties.length > 0 ? (
                  realSpecialties.map((specialty) => (
                    <SpecialtyFilterButton
                      key={specialty.id}
                      specialty={specialty.name}
                      isSelected={selectedSpecialty === specialty.name}
                      onClick={() => handleSpecialtyChange(specialty.name)}
                    />
                  ))
                ) : (
                  defaultSpecialties.map((specialty) => (
                    <SpecialtyFilterButton
                      key={specialty.id}
                      specialty={specialty.name}
                      isSelected={selectedSpecialty === specialty.name}
                      onClick={() => handleSpecialtyChange(specialty.name)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Doctors grid */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              background: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {isLoading ? 'Loading doctors...' : `Showing ${filteredDoctors.length} of ${doctors.length} doctors`}
              </h2>
              {error && (
                <div style={{
                  color: '#EF4444',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              <button
                onClick={fetchDoctors}
                style={{
                  color: '#6366F1',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>

            {isLoading ? (
              <div className="responsive-grid responsive-grid-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    animation: 'pulse 1.5s infinite ease-in-out'
                  }}>
                    <div style={{ height: '200px', background: '#E5E7EB' }}></div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ height: '16px', background: '#E5E7EB', width: '25%', marginBottom: '12px', borderRadius: '4px' }}></div>
                      <div style={{ height: '24px', background: '#E5E7EB', width: '75%', marginBottom: '12px', borderRadius: '4px' }}></div>
                      <div style={{ height: '16px', background: '#E5E7EB', width: '50%', marginBottom: '20px', borderRadius: '4px' }}></div>
                      <div style={{ height: '40px', background: '#E5E7EB', width: '100%', borderRadius: '8px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="responsive-grid responsive-grid-3">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} style={{
                      background: 'white',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                      }
                    }}>
                      <div style={{
                        height: '180px',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                      }}>
                        {doctor.user?.profile_picture ? (
                          <img
                            src={doctor.user.profile_picture}
                            alt={doctor.name}
                            style={{
                              height: '120px',
                              width: '120px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '4px solid white',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                          />
                        ) : (
                          <div style={{
                            height: '120px',
                            width: '120px',
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
                        {doctor.is_featured && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#8B5CF6'
                          }}>
                            Featured
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px'
                        }}>
                          <div style={{
                            background: '#ECFDF5',
                            color: '#059669',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            ★ {doctor.rating || '0.0'}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            fontWeight: '500'
                          }}>
                            {doctor.available ? 'Available' : 'Unavailable'}
                          </div>
                        </div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>{doctor.name}</h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#6B7280',
                          marginBottom: '12px'
                        }}>{doctor.specialty}</p>

                        {doctor.education && (
                          <p style={{
                            fontSize: '13px',
                            color: '#6B7280',
                            marginBottom: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} title={doctor.education}>
                            {doctor.education}
                          </p>
                        )}

                        <div style={{
                          marginBottom: '16px'
                        }}>
                          {doctor.consultation_fee > 0 && (
                            <p style={{
                              fontSize: '14px',
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              <span style={{ fontWeight: '600' }}>Fee:</span> ₹{doctor.consultation_fee}
                            </p>
                          )}

                          {doctor.available_days && (
                            <p style={{
                              fontSize: '13px',
                              color: '#6B7280',
                              marginBottom: '2px'
                            }}>
                              <span style={{ fontWeight: '600' }}>Available:</span> {doctor.available_days}
                            </p>
                          )}

                          {doctor.start_time && doctor.end_time && (
                            <p style={{
                              fontSize: '13px',
                              color: '#6B7280'
                            }}>
                              <span style={{ fontWeight: '600' }}>Hours:</span> {doctor.start_time} - {doctor.end_time}
                            </p>
                          )}
                        </div>

                        <button style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                        }}
                        onClick={() => window.location.href = `/appointments/${doctor.id}`}
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDoctors.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 0',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      color: '#6B7280'
                    }}>No doctors found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedSpecialty('');
                        setSearchTerm('');
                      }}
                      style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        background: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#4B5563',
                        cursor: 'pointer'
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
