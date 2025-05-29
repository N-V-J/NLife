import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message,
  Avatar
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Message sent successfully! We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradientStyle = {
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent'
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: '24px', color: '#6366F1' }} />,
      title: 'Our Location',
      content: ['Hill Place', 'Thrippunithura, Kerala', 'India - 682301']
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '24px', color: '#6366F1' }} />,
      title: 'Phone Number',
      content: ['+91 7845125487', '+91 9876543210']
    },
    {
      icon: <MailOutlined style={{ fontSize: '24px', color: '#6366F1' }} />,
      title: 'Email Address',
      content: ['nlifenvj@gmail.com', 'support@nlife.com']
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#6366F1' }} />,
      title: 'Working Hours',
      content: ['Mon - Fri: 8:00 AM - 8:00 PM', 'Sat - Sun: 9:00 AM - 6:00 PM']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title
            level={1}
            style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}
          >
            Contact Us
          </Title>
          <Paragraph style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            We're here to help you with any questions about our healthcare services.
            Get in touch with our team today.
          </Paragraph>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div style={{ padding: '80px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[32, 32]}>
            {contactInfo.map((info, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f0f0f0'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    {info.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: '12px', color: '#1f2937' }}>
                    {info.title}
                  </Title>
                  {info.content.map((line, idx) => (
                    <Paragraph key={idx} style={{ margin: '4px 0', color: '#6b7280' }}>
                      {line}
                    </Paragraph>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Contact Form Section */}
      <div style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ marginBottom: '16px' }}>
              <span style={gradientStyle}>Send Us a Message</span>
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#6b7280' }}>
              Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </Paragraph>
          </div>

          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
            bodyStyle={{ padding: '48px' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input
                      placeholder="Enter your full name"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      placeholder="Enter your email address"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input
                  placeholder="Enter the subject of your message"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter your message here..."
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Additional Info Section */}
      <div style={{ padding: '80px 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} style={{ marginBottom: '24px' }}>
                <span style={gradientStyle}>Why Choose NLife?</span>
              </Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4} style={{ marginBottom: '8px', color: '#1f2937' }}>
                    24/7 Emergency Care
                  </Title>
                  <Paragraph style={{ color: '#6b7280' }}>
                    Round-the-clock emergency services with experienced medical professionals.
                  </Paragraph>
                </div>
                <div>
                  <Title level={4} style={{ marginBottom: '8px', color: '#1f2937' }}>
                    Expert Medical Team
                  </Title>
                  <Paragraph style={{ color: '#6b7280' }}>
                    Highly qualified doctors and specialists across various medical fields.
                  </Paragraph>
                </div>
                <div>
                  <Title level={4} style={{ marginBottom: '8px', color: '#1f2937' }}>
                    Modern Facilities
                  </Title>
                  <Paragraph style={{ color: '#6b7280' }}>
                    State-of-the-art medical equipment and comfortable patient facilities.
                  </Paragraph>
                </div>
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '16px',
                  border: 'none'
                }}
                bodyStyle={{ padding: '48px', textAlign: 'center' }}
              >
                <TeamOutlined style={{ fontSize: '64px', color: 'white', marginBottom: '24px' }} />
                <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
                  Join Our Team
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '24px' }}>
                  Interested in working with us? We're always looking for talented healthcare professionals.
                </Paragraph>
                <Button
                  size="large"
                  style={{
                    background: 'white',
                    color: '#6366F1',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  View Career Opportunities
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
