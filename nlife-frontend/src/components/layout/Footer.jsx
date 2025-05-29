import { Link } from 'react-router-dom';
import { Row, Col, Typography, Space, Divider } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  GithubOutlined,
  TwitterOutlined,
  FacebookOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  return (
    <div style={{ background: '#f0f2f5', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[32, 32]}>
          {/* Logo and description */}
          <Col xs={24} sm={24} md={8} lg={8}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{
                fontSize: '24px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}>
                NLife
              </Text>
            </Link>
            <Paragraph style={{ marginTop: '16px', color: 'rgba(0, 0, 0, 0.65)' }}>
              NLife is a leading digital healthcare platform that helps patients find the right doctors and book appointments easily. Our mission is to make healthcare accessible to everyone.
            </Paragraph>
            <Space size="middle">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{
                  fontSize: '24px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent'
                }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{
                  fontSize: '24px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent'
                }} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{
                  fontSize: '24px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent'
                }} />
              </a>
            </Space>
          </Col>

          {/* Company links */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <Title level={5} style={{ marginBottom: '20px', color: 'rgba(0, 0, 0, 0.45)' }}>COMPANY</Title>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/about" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/careers" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Careers</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/contact" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Contact Us</Link>
              </li>
            </ul>
          </Col>

          {/* Support links */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <Title level={5} style={{ marginBottom: '20px', color: 'rgba(0, 0, 0, 0.45)' }}>SUPPORT</Title>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/help" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Help Center</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/terms" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Terms of Service</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/privacy" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Privacy Policy</Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link
                  to="/admin/login"
                  style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    fontWeight: '500'
                  }}
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact information */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Title level={5} style={{ marginBottom: '20px', color: 'rgba(0, 0, 0, 0.45)' }}>GET IN TOUCH</Title>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <PhoneOutlined style={{
                  marginRight: '8px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent'
                }} />
                <Text style={{ color: 'rgba(0, 0, 0, 0.65)' }}>+91 845124877</Text>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <MailOutlined style={{
                  marginRight: '8px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent'
                }} />
                <Text style={{ color: 'rgba(0, 0, 0, 0.65)' }}>nvj@nlife.com</Text>
              </li>
            </ul>
          </Col>
        </Row>

        <Divider style={{ margin: '24px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            &copy; {new Date().getFullYear()} NLife. All Rights Reserved.
          </Text>
          <span style={{ margin: '0 16px', color: 'rgba(0, 0, 0, 0.25)' }}>|</span>
          <Link
            to="/admin/login"
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
