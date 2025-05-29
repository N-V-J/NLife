import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Card,
  Row,
  Col,
  InputNumber,
  Spin
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL, AUTH_URL } from '../config/api.js';

const { Option } = Select;
const { TextArea } = Input;

const AdminEditDoctorPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // Fetch doctor data and specialties on component mount
  useEffect(() => {
    checkAdminStatus();
    fetchSpecialties();
    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId]);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    setAdminLoggedIn(!!token);
  };

  const loginAsAdmin = async () => {
    try {
      const response = await axios.post(`${AUTH_URL}/token/`, {
        email: 'admin@nlife.com',
        password: 'admin123'
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setAdminLoggedIn(true);
        message.success('Logged in as admin successfully!');
      }
    } catch (error) {
      message.error('Failed to login as admin: ' + error.message);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/specialties/`);
      setSpecialties(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      message.error('Failed to load specialties');
    }
  };

  const fetchDoctorData = async () => {
    try {
      setDoctorLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}/`);
      const doctor = response.data;

      // Set form values
      form.setFieldsValue({
        first_name: doctor.user.first_name,
        last_name: doctor.user.last_name,
        email: doctor.user.email,
        phone_number: doctor.user.phone_number,
        specialty: doctor.specialty?.id,
        consultation_fee: doctor.consultation_fee,
        bio: doctor.bio,
        education: doctor.education,
        experience_years: doctor.experience_years,
        available_days: doctor.available_days,
        start_time: doctor.start_time,
        end_time: doctor.end_time,
        is_available: doctor.is_available,
        is_featured: doctor.is_featured
      });

      // Set profile picture if exists
      if (doctor.user.profile_picture) {
        setFileList([{
          uid: '-1',
          name: 'profile_picture.jpg',
          status: 'done',
          url: `${API_BASE_URL}${doctor.user.profile_picture}`,
        }]);
      }

    } catch (error) {
      console.error('Error fetching doctor data:', error);
      message.error('Failed to load doctor data');
      navigate('/admin/doctors');
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Get authentication token
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');

      if (!token) {
        message.error('Authentication required. Please login as admin first.');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Add profile picture if uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('profile_picture', fileList[0].originFileObj);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/doctors/${doctorId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      message.success('Doctor updated successfully!');
      navigate('/admin/doctors');
    } catch (error) {
      console.error('Error updating doctor:', error);

      if (error.response?.status === 401) {
        message.error('Authentication failed. Please login as admin first.');
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
      } else if (error.response?.status === 403) {
        message.error('Permission denied. Admin access required.');
      } else {
        message.error(error.response?.data?.detail || 'Failed to update doctor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    fileList,
    onChange: handleUploadChange,
    maxCount: 1,
  };

  if (doctorLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/doctors')}
            style={{ marginRight: '16px' }}
          >
            Back to Doctors
          </Button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Edit Doctor</h1>
        </div>

        {!adminLoggedIn && (
          <Button
            type="primary"
            onClick={loginAsAdmin}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderColor: 'transparent'
            }}
          >
            Login as Admin
          </Button>
        )}

        {adminLoggedIn && (
          <div style={{ color: '#10B981', fontWeight: '600' }}>
            ✅ Admin Logged In
          </div>
        )}
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone_number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Specialty"
                name="specialty"
                rules={[{ required: true, message: 'Please select specialty' }]}
              >
                <Select placeholder="Select specialty">
                  {specialties.map(specialty => (
                    <Option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Consultation Fee (₹)"
                name="consultation_fee"
                rules={[{ required: true, message: 'Please enter consultation fee' }]}
              >
                <InputNumber
                  placeholder="Enter consultation fee"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Bio"
            name="bio"
          >
            <TextArea
              rows={3}
              placeholder="Enter doctor's bio/description"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Education"
                name="education"
              >
                <TextArea
                  rows={2}
                  placeholder="Enter education details"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Experience (Years)"
                name="experience_years"
              >
                <InputNumber
                  placeholder="Years of experience"
                  style={{ width: '100%' }}
                  min={0}
                  max={50}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Profile Picture"
            name="profile_picture"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                {fileList.length > 0 ? 'Change Picture' : 'Upload Picture'}
              </Button>
            </Upload>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button onClick={() => navigate('/admin/doctors')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                borderColor: 'transparent'
              }}
            >
              Update Doctor
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminEditDoctorPage;
