import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Space, Card } from 'antd';
import {
  CalendarOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const CtaSection = () => {
  const features = [
    {
      icon: <CheckCircleOutlined />,
      title: 'Verified Doctors',
      description: 'All our doctors are certified and verified professionals'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Quick Booking',
      description: 'Book appointments in just a few minutes'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Secure Platform',
      description: 'Your health data is safe and secure with us'
    },
    {
      icon: <HeartOutlined />,
      title: 'Quality Care',
      description: 'Receive the best medical care from experts'
    }
  ];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      padding: '80px 0',
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
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <Row gutter={[48, 48]} align="middle">
          {/* Left Content */}
          <Col xs={24} lg={12}>
            <div style={{ color: 'white' }}>
              <Title
                level={2}
                style={{
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '24px'
                }}
              >
                Ready to Take Control of
                <span style={{
                  background: 'linear-gradient(45deg, #6366F1, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block'
                }}>
                  Your Health?
                </span>
              </Title>

              <Paragraph
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  marginBottom: '32px',
                  maxWidth: '500px'
                }}
              >
                Join thousands of satisfied patients who trust NLife for their healthcare needs.
                Book your appointment today and experience world-class medical care.
              </Paragraph>

              <Space size="large" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderColor: 'transparent',
                    height: '50px',
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  <Link to="/doctors" style={{ color: 'white' }}>
                    Book Appointment Now
                  </Link>
                </Button>

                <Button
                  size="large"
                  icon={<PhoneOutlined />}
                  style={{
                    background: 'transparent',
                    borderColor: 'white',
                    color: 'white',
                    height: '50px',
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  <Link to="/contact" style={{ color: 'white' }}>
                    Contact Support
                  </Link>
                </Button>
              </Space>
            </div>
          </Col>

          {/* Right Content - Feature Cards */}
          <Col xs={24} lg={12}>
            <Row gutter={[16, 16]}>
              {features.map((feature, index) => (
                <Col key={index} span={12}>
                  <Card
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '20px', textAlign: 'center' }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      color: '#6366F1',
                      marginBottom: '12px'
                    }}>
                      {feature.icon}
                    </div>

                    <Title level={5} style={{
                      color: 'white',
                      margin: '0 0 8px 0',
                      fontSize: '16px'
                    }}>
                      {feature.title}
                    </Title>

                    <Paragraph style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Bottom Stats */}
        <Row gutter={[32, 16]} style={{ marginTop: '64px', textAlign: 'center' }}>
          <Col xs={12} sm={6}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>500+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Expert Doctors</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>50K+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Happy Patients</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>25+</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Specialties</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>24/7</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Support</div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default CtaSection;
