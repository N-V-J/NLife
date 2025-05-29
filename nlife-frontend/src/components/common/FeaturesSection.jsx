import { Row, Col, Typography, Card } from 'antd';
import {
  MobileOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  HeartOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FeaturesSection = () => {
  const features = [
    {
      icon: <MobileOutlined />,
      title: 'Easy Online Booking',
      description: 'Book appointments anytime, anywhere with our user-friendly platform. No more waiting on hold or visiting clinics just to schedule.',
      color: '#6366F1'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Verified Healthcare Professionals',
      description: 'All our doctors are thoroughly verified, licensed, and have years of experience in their respective specialties.',
      color: '#10B981'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Flexible Scheduling',
      description: 'Choose from available time slots that fit your schedule. Get instant confirmation and reminders for your appointments.',
      color: '#F59E0B'
    },
    {
      icon: <TeamOutlined />,
      title: 'Comprehensive Care',
      description: 'From general consultations to specialized treatments, we offer a wide range of medical services under one roof.',
      color: '#EF4444'
    },
    {
      icon: <HeartOutlined />,
      title: 'Patient-Centered Approach',
      description: 'Your health and comfort are our top priorities. We ensure personalized care tailored to your specific needs.',
      color: '#EC4899'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Telemedicine Support',
      description: 'Access healthcare remotely through our telemedicine platform. Consult with doctors from the comfort of your home.',
      color: '#8B5CF6'
    }
  ];

  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={2} style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Why Choose 
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginLeft: '8px'
            }}>
              NLife?
            </span>
          </Title>
          
          <Paragraph style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            We're committed to revolutionizing healthcare by making it more accessible, 
            convenient, and patient-focused. Here's what sets us apart.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} md={12} lg={8}>
              <Card
                style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '32px 24px' }}
                className="feature-card"
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '1.5rem',
                  color: feature.color
                }}>
                  {feature.icon}
                </div>
                
                <Title level={4} style={{
                  margin: '0 0 12px 0',
                  color: '#1f2937',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </Title>
                
                <Paragraph style={{
                  margin: 0,
                  color: '#6b7280',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <style jsx>{`
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
