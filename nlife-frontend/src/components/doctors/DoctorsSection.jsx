import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, Rate, Avatar, Tag, Spin } from 'antd';
import {
  CalendarOutlined,
  StarFilled,
  UserOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { getDoctorProfilePicture } from '../../utils/imageUtils';

const { Title, Paragraph, Text } = Typography;

const DoctorCard = ({ doctor }) => {
  const doctorName = doctor.user ?
    `Dr. ${doctor.user.first_name} ${doctor.user.last_name}`.trim() :
    'Dr. Unknown';

  const specialtyName = doctor.specialty?.name || 'General Practice';
  const profilePicture = getDoctorProfilePicture(doctor);

  return (
    <Card
      hoverable
      style={{
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        height: '100%'
      }}
      bodyStyle={{ padding: '24px' }}
      className="doctor-card"
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Avatar
          size={80}
          src={profilePicture}
          style={{
            backgroundColor: profilePicture ? 'transparent' : '#6366F1',
            marginBottom: '16px'
          }}
          icon={!profilePicture && <UserOutlined />}
        />

        <div style={{ marginBottom: '8px' }}>
          <Rate
            disabled
            defaultValue={doctor.rating || 4.5}
            style={{ fontSize: '14px', color: '#faad14' }}
          />
          <Text style={{
            marginLeft: '8px',
            color: '#666',
            fontSize: '14px'
          }}>
            {doctor.rating || '4.5'} ({doctor.total_reviews || '0'} reviews)
          </Text>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Title level={4} style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          {doctorName}
        </Title>

        <Tag color="blue" style={{
          marginBottom: '12px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {specialtyName}
        </Tag>

        <Paragraph style={{
          margin: '0 0 16px 0',
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {doctor.experience_years ? `${doctor.experience_years} years experience` : 'Experienced professional'}
        </Paragraph>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <Text style={{ fontSize: '14px', color: '#666' }}>Consultation Fee</Text>
          <Text style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#6366F1'
          }}>
            ₹{doctor.consultation_fee || '500'}
          </Text>
        </div>

        <Button
          type="primary"
          block
          icon={<CalendarOutlined />}
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            borderColor: 'transparent',
            borderRadius: '8px',
            height: '40px',
            fontWeight: '500'
          }}
        >
          <Link to={`/appointments/${doctor.id}`} style={{ color: 'white' }}>
            Book Appointment
          </Link>
        </Button>
      </div>
    </Card>
  );
};

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://nlife-backend-debug.onrender.com/api/doctors/');

      // Get the first 4 doctors for the homepage
      const doctorsData = response.data.results || response.data;
      const topDoctors = Array.isArray(doctorsData) ? doctorsData.slice(0, 4) : [];

      setDoctors(topDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Set empty array on error
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      padding: '80px 0',
      background: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={2} style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Meet Our
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginLeft: '8px'
            }}>
              Expert Doctors
            </span>
          </Title>

          <Paragraph style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Connect with our highly qualified and experienced medical professionals
            who are dedicated to providing you with the best healthcare services.
          </Paragraph>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#666' }}>Loading doctors...</div>
          </div>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {doctors.map((doctor) => (
                <Col key={doctor.id} xs={24} sm={12} lg={6}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Button
                type="default"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  borderColor: '#6366F1',
                  color: '#6366F1',
                  borderRadius: '8px',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <Link to="/doctors" style={{ color: '#6366F1' }}>
                  View All Doctors
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .doctor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default DoctorsSection;
