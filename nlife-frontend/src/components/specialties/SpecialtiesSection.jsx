import { Link } from 'react-router-dom';
import { Row, Col, Card, Typography, Button } from 'antd';
import {
  HeartOutlined,
  EyeOutlined,
  ExperimentOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const specialties = [
  {
    id: 1,
    name: 'Cardiology',
    icon: <HeartOutlined />,
    description: 'Heart and cardiovascular care',
    color: '#EF4444',
    path: '/doctors?specialty=cardiology'
  },
  {
    id: 2,
    name: 'Neurology',
    icon: <ExperimentOutlined />,
    description: 'Brain and nervous system',
    color: '#8B5CF6',
    path: '/doctors?specialty=neurology'
  },
  {
    id: 3,
    name: 'Ophthalmology',
    icon: <EyeOutlined />,
    description: 'Eye care and vision',
    color: '#10B981',
    path: '/doctors?specialty=ophthalmology'
  },
  {
    id: 4,
    name: 'General Practice',
    icon: <UserOutlined />,
    description: 'Primary healthcare',
    color: '#6366F1',
    path: '/doctors?specialty=general-practice'
  },
  {
    id: 5,
    name: 'Pediatrics',
    icon: <TeamOutlined />,
    description: 'Children\'s healthcare',
    color: '#F59E0B',
    path: '/doctors?specialty=pediatrics'
  },
  {
    id: 6,
    name: 'Dermatology',
    icon: <MedicineBoxOutlined />,
    description: 'Skin and beauty care',
    color: '#EC4899',
    path: '/doctors?specialty=dermatology'
  },
];

const SpecialtyCard = ({ specialty }) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        height: '100%'
      }}
      bodyStyle={{ padding: '32px 24px', textAlign: 'center' }}
      className="specialty-card"
    >
      <Link to={specialty.path} style={{ textDecoration: 'none' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${specialty.color}15, ${specialty.color}25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '2rem',
          color: specialty.color
        }}>
          {specialty.icon}
        </div>

        <Title level={4} style={{
          margin: '0 0 8px 0',
          color: '#1f2937',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {specialty.name}
        </Title>

        <Paragraph style={{
          margin: '0 0 16px 0',
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {specialty.description}
        </Paragraph>

        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          style={{
            color: specialty.color,
            fontWeight: '500',
            padding: '0',
            height: 'auto'
          }}
        >
          View Doctors
        </Button>
      </Link>
    </Card>
  );
};

const SpecialtiesSection = () => {
  return (
    <section style={{
      padding: '80px 0',
      background: '#fafafa'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={2} style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Find Care by
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginLeft: '8px'
            }}>
              Specialty
            </span>
          </Title>

          <Paragraph style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Browse through our comprehensive range of medical specialties and connect with
            experienced healthcare professionals who are experts in their field.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {specialties.map((specialty) => (
            <Col key={specialty.id} xs={24} sm={12} lg={8}>
              <SpecialtyCard specialty={specialty} />
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Button
            type="primary"
            size="large"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderColor: 'transparent',
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <Link to="/doctors" style={{ color: 'white' }}>
              View All Doctors
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .specialty-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default SpecialtiesSection;
