import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Card, Typography, message, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AUTH_URL } from '../../config/api';

const { Title, Text } = Typography;

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Verify user is admin
        const userResponse = await fetch(`${AUTH_URL}/me/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          if (userData.user_type === 'admin' || userData.is_staff) {
            // Store tokens
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            message.success('Successfully logged in as admin!');
            navigate(from, { replace: true });
          } else {
            message.error('Access denied. Admin privileges required.');
          }
        } else {
          message.error('Failed to verify user credentials.');
        }
      } else {
        const errorData = await response.json();
        message.error(errorData.detail || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${AUTH_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@nlife.com',
          password: 'admin123'
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        message.success('Successfully logged in as admin!');
        navigate(from, { replace: true });
      } else {
        message.error('Quick login failed.');
      }
    } catch (error) {
      console.error('Quick login error:', error);
      message.error('Quick login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      backgroundSize: 'cover',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 450,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '30px' }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <Avatar
              size={60}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '32px',
                border: '2px solid rgba(255, 255, 255, 0.6)'
              }}
              icon={<UserOutlined />}
            />
          </div>
          <Title level={2} style={{ marginBottom: '8px', color: '#111827' }}>
            NLife Admin
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Sign in to access the admin dashboard
          </Text>
        </div>

        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#6366F1' }} />}
              placeholder="Email"
              style={{ borderRadius: '8px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#6366F1' }} />}
              placeholder="Password"
              style={{ borderRadius: '8px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  message.info('Password reset functionality would be implemented in a real app.');
                }}
                style={{ color: '#6366F1' }}
              >
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              Sign in
            </Button>
          </Form.Item>

          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
              Demo Credentials
            </Text>
            <div style={{
              padding: '8px 16px',
              background: 'white',
              borderRadius: '6px',
              border: '1px dashed #d9d9d9',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '12px'
            }}>
              <div>Email: <Text strong>admin@nlife.com</Text></div>
              <div>Password: <Text strong>admin123</Text></div>
            </div>
            <Button
              type="default"
              onClick={handleQuickLogin}
              loading={loading}
              style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                color: 'white'
              }}
            >
              Quick Admin Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
