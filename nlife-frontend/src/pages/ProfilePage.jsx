import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Avatar,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Divider,
  message,
  Descriptions,
  Spin,
  Upload
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  UploadOutlined,
  CameraOutlined,
  MedicineBoxOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import { getUserProfile, updateUserProfile, getAuthAxios } from '../services/userService';
import { processImageUrl } from '../utils/imageUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const ProfilePage = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile data
        let userProfile;
        if (currentUser) {
          userProfile = currentUser;
        } else {
          userProfile = await getUserProfile();
        }

        setUserData({
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          email: userProfile.email,
          phone: userProfile.phone_number || '',
          address: userProfile.address || '',
          gender: userProfile.gender || '',
          birthday: userProfile.date_of_birth || '',
          blood_group: userProfile.blood_group || '',
          profileImage: processImageUrl(userProfile.profile_picture)
        });

        // Fetch patient profile data if user is a patient
        if (userProfile.user_type === 'patient') {
          try {
            const authAxios = getAuthAxios();
            const response = await authAxios.get('patients/');

            // Find the patient record for the current user
            let patientProfile = null;
            if (Array.isArray(response.data)) {
              patientProfile = response.data.find(patient =>
                patient.user && patient.user.id === userProfile.id
              );
            } else if (response.data.results) {
              patientProfile = response.data.results.find(patient =>
                patient.user && patient.user.id === userProfile.id
              );
            }

            if (patientProfile) {
              setPatientData({
                id: patientProfile.id,
                medical_history: patientProfile.medical_history || '',
                allergies: patientProfile.allergies || '',
                emergency_contact: patientProfile.emergency_contact || ''
              });
            }
          } catch (patientError) {
            console.error('Error fetching patient data:', patientError);
            // Don't show error message for patient data as it's optional
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Image handling functions
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
    return false; // Prevent auto upload
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setImageFile(info.file.originFileObj || info.file);
      getBase64(info.file.originFileObj || info.file, (url) => {
        setImageUrl(url);
      });
    }
  };

  const uploadProfileImage = async () => {
    if (!imageFile) {
      message.error('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', imageFile);

      // Update profile with new image
      const response = await updateUserProfile(formData);

      // Update local state
      setUserData(prev => ({
        ...prev,
        profileImage: processImageUrl(response.profile_picture) || imageUrl
      }));

      message.success('Profile picture updated successfully!');
      setImageFile(null);
      setImageUrl('');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = () => {
    const formData = {
      ...userData,
      ...(currentUser?.user_type === 'patient' && {
        medical_history: patientData?.medical_history || '',
        allergies: patientData?.allergies || '',
        emergency_contact: patientData?.emergency_contact || ''
      })
    };
    form.setFieldsValue(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImageUrl('');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Separate user data from patient data
      const { medical_history, allergies, emergency_contact, ...userValues } = values;

      // Create FormData for user profile update
      const formData = new FormData();

      // Add user form fields
      Object.keys(userValues).forEach(key => {
        if (userValues[key] !== undefined && userValues[key] !== null) {
          formData.append(key, userValues[key]);
        }
      });

      // Add profile picture if selected
      if (imageFile) {
        formData.append('profile_picture', imageFile);
      }

      // Update user profile
      const response = await updateUserProfile(formData);

      // Update or create patient data if user is a patient
      if (currentUser?.user_type === 'patient' && (medical_history !== undefined || allergies !== undefined || emergency_contact !== undefined)) {
        try {
          const authAxios = getAuthAxios();
          const patientUpdateData = {
            medical_history: medical_history || '',
            allergies: allergies || '',
            emergency_contact: emergency_contact || ''
          };

          if (patientData && patientData.id) {
            // Update existing patient record
            await authAxios.put(`patients/${patientData.id}/`, patientUpdateData);
          } else {
            // Create new patient record
            const createData = {
              ...patientUpdateData,
              user: currentUser.id
            };
            const createResponse = await authAxios.post('patients/', createData);
            setPatientData({
              id: createResponse.data.id,
              ...patientUpdateData
            });
          }

          // Update local patient state
          setPatientData(prev => ({
            ...prev,
            ...patientUpdateData
          }));
        } catch (patientError) {
          console.error('Error updating patient data:', patientError);
          message.warning('User profile updated, but failed to update medical information');
        }
      }

      // Update local user state
      setUserData({
        ...userValues,
        profileImage: processImageUrl(response.profile_picture) || imageUrl || userData.profileImage
      });

      setIsEditing(false);
      setImageFile(null);
      setImageUrl('');

      message.success('Profile information saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
        <Card bordered={false}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '20px' }}>Loading profile...</div>
            </div>
          ) : !userData ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div>No profile data available. Please log in.</div>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {/* Profile Image Section */}
              <Col xs={24} sm={24} md={8} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    src={imageUrl || userData.profileImage}
                    style={{ backgroundColor: '#6366F1' }}
                  />
                  {isEditing && (
                    <Upload
                      name="avatar"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleImageChange}
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess("ok");
                        }, 0);
                      }}
                    >
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<CameraOutlined />}
                        size="small"
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          backgroundColor: '#6366F1',
                          borderColor: '#6366F1'
                        }}
                      />
                    </Upload>
                  )}
                </div>

                {imageFile && !isEditing && (
                  <div style={{ marginBottom: '16px' }}>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={uploadProfileImage}
                      loading={uploading}
                      style={{
                        backgroundColor: '#6366F1',
                        borderColor: '#6366F1'
                      }}
                    >
                      Upload Picture
                    </Button>
                  </div>
                )}

                <Title level={3}>{userData.name}</Title>
              </Col>

            {/* Profile Information Section */}
            <Col xs={24} sm={24} md={16}>
              <Title level={4} style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                Profile Information
              </Title>

              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={userData}
                  onFinish={handleSubmit}
                >
                  <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>CONTACT INFORMATION</Title>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please input your email!' },
                          { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                  >
                    <Input.TextArea rows={2} placeholder="Address" />
                  </Form.Item>

                  <Divider style={{ margin: '16px 0' }} />

                  <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>BASIC INFORMATION</Title>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select your gender!' }]}
                      >
                        <Select placeholder="Select your gender">
                          <Option value="Male">Male</Option>
                          <Option value="Female">Female</Option>
                          <Option value="Other">Other</Option>
                          <Option value="Prefer not to say">Prefer not to say</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="birthday"
                        label="Birthday"
                        rules={[{ required: true, message: 'Please input your birthday!' }]}
                      >
                        <Input prefix={<CalendarOutlined />} placeholder="Birthday" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="blood_group"
                        label="Blood Group"
                        rules={[{ required: true, message: 'Please select your blood group!' }]}
                      >
                        <Select placeholder="Select your blood group">
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
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergency_contact"
                        label="Emergency Contact"
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Emergency Contact Number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Medical Information Section - Only show for patients */}
                  {currentUser?.user_type === 'patient' && (
                    <>
                      <Divider style={{ margin: '16px 0' }} />
                      <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>MEDICAL INFORMATION</Title>
                      <div style={{
                        backgroundColor: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        color: '#389e0d'
                      }}>
                        <strong>Important:</strong> This information helps healthcare providers give you better care.
                        Please keep it accurate and up-to-date.
                      </div>

                      <Form.Item
                        name="medical_history"
                        label={
                          <span>
                            <MedicineBoxOutlined style={{ marginRight: '8px', color: '#6366F1' }} />
                            Medical History
                          </span>
                        }
                      >
                        <Input.TextArea
                          rows={4}
                          placeholder="Enter your medical history, past surgeries, chronic conditions, etc."
                          showCount
                          maxLength={1000}
                        />
                      </Form.Item>

                      <Form.Item
                        name="allergies"
                        label={
                          <span>
                            <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#f5222d' }} />
                            Allergies
                          </span>
                        }
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Enter any allergies to medications, foods, or other substances"
                          showCount
                          maxLength={500}
                        />
                      </Form.Item>
                    </>
                  )}

                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                      Save Information
                    </Button>
                    <Button onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <>
                  <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>CONTACT INFORMATION</Title>
                  <Descriptions column={{ xs: 1, sm: 2 }} style={{ marginBottom: '24px' }}>
                    <Descriptions.Item label="Email">
                      <a href={`mailto:${userData.email}`} style={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textFillColor: 'transparent'
                      }}>
                        {userData.email}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">{userData.phone}</Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>{userData.address}</Descriptions.Item>
                  </Descriptions>

                  <Divider style={{ margin: '16px 0' }} />

                  <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>BASIC INFORMATION</Title>
                  <Descriptions column={{ xs: 1, sm: 2 }} style={{ marginBottom: '24px' }}>
                    <Descriptions.Item label="Gender">{userData.gender}</Descriptions.Item>
                    <Descriptions.Item label="Birthday">{userData.birthday}</Descriptions.Item>
                    <Descriptions.Item label="Blood Group">{userData.blood_group}</Descriptions.Item>
                    {currentUser?.user_type === 'patient' && (
                      <Descriptions.Item label="Emergency Contact">{patientData?.emergency_contact || 'Not specified'}</Descriptions.Item>
                    )}
                  </Descriptions>

                  {/* Medical Information Section - Only show for patients */}
                  {currentUser?.user_type === 'patient' && (
                    <>
                      <Divider style={{ margin: '16px 0' }} />
                      <Title level={5} style={{ color: 'rgba(0, 0, 0, 0.45)' }}>MEDICAL INFORMATION</Title>
                      <Descriptions column={1} style={{ marginBottom: '24px' }}>
                        <Descriptions.Item label="Medical History">
                          <div style={{ whiteSpace: 'pre-wrap', maxWidth: '600px' }}>
                            {patientData?.medical_history || 'No medical history recorded'}
                          </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Allergies">
                          <div style={{ whiteSpace: 'pre-wrap', maxWidth: '600px' }}>
                            {patientData?.allergies || 'No known allergies'}
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  )}

                  <div style={{ marginTop: '24px' }}>
                    <Button onClick={handleEdit} style={{ marginRight: '8px' }}>
                      Edit
                    </Button>
                    <Button type="primary">
                      Save Information
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
