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
  Avatar,
  Checkbox,
  DatePicker,
  Radio,
  Select
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HeartFilled,
  PhoneOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { register } = useUser();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Format the date_of_birth to YYYY-MM-DD format
      const formattedValues = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null
      };

      console.log('SignUpPage - Sending data to register:', formattedValues);

      // Register the user with userType set to 'patient'
      const result = await register(formattedValues);

      console.log('SignUpPage - Registration result:', result);

      if (result.success) {
        message.success('Account created successfully!');
        // Redirect to login page
        navigate('/login');
      } else {
        // Display specific error message if available
        if (typeof result.error === 'object') {
          // Handle nested error objects
          const errorMessages = [];
          for (const key in result.error) {
            const errorValue = result.error[key];
            if (Array.isArray(errorValue)) {
              errorMessages.push(`${key}: ${errorValue.join(', ')}`);
            } else if (typeof errorValue === 'string') {
              errorMessages.push(`${key}: ${errorValue}`);
            }
          }
          if (errorMessages.length > 0) {
            message.error(errorMessages.join('; '));
          } else {
            message.error('Failed to create account. Please try again.');
          }
        } else {
          message.error(result.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Failed to create account. Please try again.');
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
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>

              <Title level={2} style={{ fontSize: '28px', marginBottom: '8px', color: '#111827' }}>
                Create Account
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Join NLife to book your appointments
              </Text>
            </div>

            <Divider style={{ margin: '0 0 24px' }}></Divider>

            <Form
              form={form}
              name="register"
              layout="vertical"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="first_name"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>First Name</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your first name!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Enter your first name"
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
                name="last_name"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Last Name</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your last name!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Enter your last name"
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
                name="phone_number"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Phone Number</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Enter your phone number"
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
                  {
                    min: 6,
                    message: 'Password must be at least 6 characters!',
                  },
                ]}
                hasFeedback
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

              <Form.Item
                name="password2"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Confirm Password</span>}
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#6366F1' }} />}
                  placeholder="Confirm your password"
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
                name="gender"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Gender</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please select your gender!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="date_of_birth"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Date of Birth</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please select your date of birth!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <DatePicker
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    height: '48px',
                    boxShadow: 'none',
                    fontSize: '15px'
                  }}
                  size="large"
                  placeholder="Select your date of birth"
                />
              </Form.Item>

              <Form.Item
                name="blood_group"
                label={<span style={{ fontSize: '15px', fontWeight: '500' }}>Blood Group</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please select your blood group!',
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Select
                  placeholder="Select your blood group"
                  size="large"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    height: '48px',
                    fontSize: '15px'
                  }}
                >
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
                  },
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Checkbox>
                  I agree to the <Link to="/terms" style={{ color: '#6366F1' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#6366F1' }}>Privacy Policy</Link>
                </Checkbox>
              </Form.Item>

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
                  icon={<CheckCircleOutlined />}
                >
                  Create Account
                </Button>
              </Form.Item>

              <Divider style={{ margin: '32px 0 24px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>OR</Text>
              </Divider>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Space direction="horizontal" align="center" size="middle">
                  <Text type="secondary" style={{ fontSize: '15px' }}>Already have an account?</Text>
                  <Link to="/login" style={{
                    color: '#6366F1',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    Sign in here
                  </Link>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignUpPage;
