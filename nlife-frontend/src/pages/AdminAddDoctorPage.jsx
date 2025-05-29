import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hardcoded production backend URL
const PRODUCTION_BACKEND = 'https://nlife-backend-debug.onrender.com';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Typography,
  Divider,
  InputNumber,
  Row,
  Col,
  Card
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined,
  PhoneOutlined,
  BookOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminAddDoctorPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchSpecialties();
  }, []);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('access_token');
    setAdminLoggedIn(!!token);
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(`${PRODUCTION_BACKEND}/api/specialties/`);

      let specialtiesData = [];
      if (Array.isArray(response.data)) {
        specialtiesData = response.data;
      } else if (response.data && response.data.results) {
        specialtiesData = response.data.results;
      }

      setSpecialties(specialtiesData);
    } catch (error) {
      // Set default specialties if backend is not available
      setSpecialties([
        { id: 1, name: 'Cardiology' },
        { id: 2, name: 'Dermatology' },
        { id: 3, name: 'Neurology' },
        { id: 4, name: 'Orthopedics' },
        { id: 5, name: 'Pediatrics' }
      ]);
    }
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setImageFile(info.file.originFileObj || info.file);

      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(info.file.originFileObj || info.file);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);

    return false; // Prevent auto upload
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Check if admin is logged in
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Please login as admin first!');
        setLoading(false);
        return;
      }

      // Get specialty name
      const specialty = specialties.find(s => s.id === values.specialty);
      const specialtyName = specialty ? specialty.name : 'General';

      // Format available days
      const availableDays = Array.isArray(values.available_days)
        ? values.available_days.join(',')
        : 'Monday,Tuesday,Wednesday,Thursday,Friday';

      // Create FormData
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('password2', values.password);
      formData.append('phone_number', values.phone_number || '');
      formData.append('specialization', specialtyName);
      formData.append('gender', values.gender);
      formData.append('bio', values.bio);
      formData.append('education', values.education);
      formData.append('experience_years', values.experience_years);
      formData.append('consultation_fee', values.consultation_fee);
      formData.append('available_days', availableDays);
      formData.append('start_time', values.start_time);
      formData.append('end_time', values.end_time);

      if (imageFile) {
        formData.append('profile_picture', imageFile);
      }

      // Submit to backend
      await axios.post(`${PRODUCTION_BACKEND}/api/auth/register/doctor/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(`Doctor ${values.first_name} ${values.last_name} added successfully!`);

      // Reset form
      form.resetFields();
      setImageUrl('');
      setImageFile(null);

      // Open Django admin
      window.open(`${PRODUCTION_BACKEND}/admin/hospital/doctor/`, '_blank');

      // Redirect to doctors list
      setTimeout(() => navigate('/admin/doctors'), 1500);
    } catch (error) {
      let errorMessage = 'Failed to add doctor. ';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login as admin first.';
        localStorage.removeItem('access_token');
        setAdminLoggedIn(false);
      } else if (error.response?.status === 400 && error.response?.data) {
        const errors = [];
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            errors.push(`${key}: ${error.response.data[key].join(', ')}`);
          } else {
            errors.push(`${key}: ${error.response.data[key]}`);
          }
        });
        errorMessage += errors.join('. ');
      } else {
        errorMessage += 'Please try again.';
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    try {
      const response = await axios.post(`${PRODUCTION_BACKEND}/api/auth/token/`, {
        email: 'admin@nlife.com',
        password: 'admin123'
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setAdminLoggedIn(true);
        alert('Logged in as admin successfully!');
      }
    } catch (error) {
      alert('Failed to login as admin: ' + error.message);
    }
  };

  const daysOfWeek = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeOptions.push({ label: `${hour}:00`, value: `${hour}:00:00` });
    timeOptions.push({ label: `${hour}:30`, value: `${hour}:30:00` });
  }



  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0, background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Add New Doctor
            </Title>
            <Text type="secondary">Fill in the details to add a new doctor to the system</Text>
            <div style={{ marginTop: 8 }}>

            </div>
          </div>

        </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          gender: 'male',
          available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          start_time: '09:00:00',
          end_time: '17:00:00'
        }}
      >
        <Row gutter={24}>
          <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
            <Form.Item
              name="profile_picture"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList && e.fileList.length ? e.fileList[0].originFileObj : null;
              }}
            >
              <Upload
                name="profile_picture"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                style={{ display: 'inline-block' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload doctor picture</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Doctor Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="password"
              label="Doctor Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: false }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number (Optional)" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="specialty"
              label="Specialty"
              rules={[{ required: true, message: 'Please select specialty' }]}
            >
              <Select placeholder="Select specialty">
                {Array.isArray(specialties) && specialties.length > 0 ? (
                  specialties.map(specialty => (
                    <Option key={specialty.id} value={specialty.id}>{specialty.name}</Option>
                  ))
                ) : (
                  <Option value="loading" disabled>Loading specialties...</Option>
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select placeholder="Select gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="education"
              label="Education"
              rules={[{ required: true, message: 'Please enter education' }]}
            >
              <Input prefix={<BookOutlined />} placeholder="Education" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="experience_years"
              label="Experience (Years)"
              rules={[{ required: true, message: 'Please enter experience' }]}
            >
              <InputNumber min={0} max={50} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="consultation_fee"
              label="Consultation Fee (₹)"
              rules={[{ required: true, message: 'Please enter consultation fee' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₹\s?|(,*)/g, '')}
                prefix={<DollarOutlined />}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="available_days"
              label="Available Days"
              rules={[{ required: true, message: 'Please select available days' }]}
            >
              <Select mode="multiple" placeholder="Select available days">
                {daysOfWeek.map(day => (
                  <Option key={day.value} value={day.value}>{day.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[{ required: true, message: 'Please select start time' }]}
            >
              <Select placeholder="Select start time">
                {timeOptions.map(time => (
                  <Option key={time.value} value={time.value}>{time.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true, message: 'Please select end time' }]}
            >
              <Select placeholder="Select end time">
                {timeOptions.map(time => (
                  <Option key={time.value} value={time.value}>{time.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="bio"
              label="Bio"
              rules={[{ required: true, message: 'Please enter bio' }]}
            >
              <TextArea rows={4} placeholder="Write about yourself" />
            </Form.Item>
          </Col>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="default" style={{ marginRight: 8 }} onClick={() => navigate('/admin/doctors')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Doctor
            </Button>
          </Col>
        </Row>
      </Form>
      </Card>
    </div>
  );
};

export default AdminAddDoctorPage;
