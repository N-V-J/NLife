import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Space, Card, Statistic } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative' }}>
        <Row gutter={[48, 48]} align="middle">
          {/* Left Content */}
          <Col xs={24} lg={12}>
            <div style={{ color: 'white' }}>
              <Title
                level={1}
                className="hero-title"
                style={{
                  color: 'white',
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  marginBottom: '24px'
                }}
              >
                Your Health,
                <br />
                <span style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Our Priority
                </span>
              </Title>

              <Paragraph
                className="hero-subtitle"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.25rem',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                  maxWidth: '500px'
                }}
              >
                Connect with trusted healthcare professionals and book appointments seamlessly.
                Experience world-class medical care with NLife's comprehensive healthcare platform.
              </Paragraph>

              <Space size="large" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  style={{
                    background: 'white',
                    borderColor: 'white',
                    color: '#6366F1',
                    fontWeight: '600',
                    height: '50px',
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <Link to="/doctors" style={{ color: '#6366F1' }}>
                    Book Appointment
                  </Link>
                </Button>

                <Button
                  size="large"
                  icon={<UserOutlined />}
                  style={{
                    background: 'transparent',
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: '600',
                    height: '50px',
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                >
                  <Link to="/about" style={{ color: 'white' }}>
                    Learn More
                  </Link>
                </Button>
              </Space>

              {/* Stats */}
              <Row gutter={[24, 16]} style={{ marginTop: '48px' }}>
                <Col xs={8} sm={8} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>500+</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Expert Doctors</div>
                  </div>
                </Col>
                <Col xs={8} sm={8} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>50K+</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Happy Patients</div>
                  </div>
                </Col>
                <Col xs={8} sm={8} md={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>24/7</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Support</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Content */}
          <Col xs={24} lg={12}>
            <div style={{ position: 'relative' }}>
              {/* Feature Cards */}
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <SafetyCertificateOutlined
                        style={{
                          fontSize: '2rem',
                          color: '#6366F1',
                          marginBottom: '12px'
                        }}
                      />
                      <Title level={5} style={{ margin: '0 0 8px 0' }}>Certified Doctors</Title>
                      <Paragraph style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        All our doctors are verified and certified professionals
                      </Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      marginTop: '24px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <ClockCircleOutlined
                        style={{
                          fontSize: '2rem',
                          color: '#8B5CF6',
                          marginBottom: '12px'
                        }}
                      />
                      <Title level={5} style={{ margin: '0 0 8px 0' }}>Quick Booking</Title>
                      <Paragraph style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Book appointments in just a few clicks
                      </Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      marginTop: '-12px'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <HeartOutlined
                        style={{
                          fontSize: '2rem',
                          color: '#EF4444',
                          marginBottom: '12px'
                        }}
                      />
                      <Title level={5} style={{ margin: '0 0 8px 0' }}>Quality Care</Title>
                      <Paragraph style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Comprehensive healthcare solutions
                      </Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <TeamOutlined
                        style={{
                          fontSize: '2rem',
                          color: '#10B981',
                          marginBottom: '12px'
                        }}
                      />
                      <Title level={5} style={{ margin: '0 0 8px 0' }}>Expert Team</Title>
                      <Paragraph style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Experienced medical professionals
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Hero;
