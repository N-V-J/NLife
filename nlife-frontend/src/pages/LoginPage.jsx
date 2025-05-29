import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
  Row,
  Col,
  Divider,
  Avatar
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  HeartFilled,
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useUser();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Login the user
      const result = await login(values.email, values.password);

      if (result.success) {
        message.success('Login successful!');

        // Redirect based on user type
        if (result.user.userType === 'patient') {
          navigate('/');
        } else if (result.user.userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (result.user.userType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error(result.error || 'Failed to login. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)', // Adjust for header height
      padding: '40px 20px',
      background: '#f5f7fa'
    }}>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={22} sm={18} md={14} lg={10} xl={8}>
          <Card
            bordered={false}
            style={{
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '450px',
              margin: '0 auto',
              width: '100%'
            }}
          >
            <div style={{ marginBottom: '32px' }}>
              <Title level={2} style={{ fontSize: '28px', marginBottom: '8px', color: '#111827' }}>
                Welcome to NLife
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Please login to book your appointment
              </Text>
            </div>

            <Divider style={{ margin: '0 0 24px' }}></Divider>

            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Email</span>}
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not a valid email!',
                  },
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Enter your email"
                  size="large"
                  style={{
                    borderRadius: '8px',
                    height: '48px',
                    boxShadow: 'none',
                    fontSize: '15px'
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Password</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Enter your password"
                  size="large"
                  style={{
                    borderRadius: '8px',
                    height: '48px',
                    boxShadow: 'none',
                    fontSize: '15px'
                  }}
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Link to="/forgot-password" style={{ color: '#6366F1', fontSize: '14px', fontWeight: '500' }}>
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginTop: '32px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    height: '50px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>

              <Divider style={{ margin: '32px 0 24px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>OR</Text>
              </Divider>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Space direction="horizontal" align="center" size="middle">
                  <Text type="secondary" style={{ fontSize: '15px' }}>Don't have an account?</Text>
                  <Link to="/register" style={{
                    color: '#6366F1',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    Create account
                  </Link>
                </Space>
              </div>

              <div style={{
                marginTop: '32px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid #f0f0f0'
              }}>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', lineHeight: '1.5' }}>
                  By logging in, you agree to our <Link to="/terms" style={{ color: '#6366F1' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#6366F1' }}>Privacy Policy</Link>
                </Text>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
