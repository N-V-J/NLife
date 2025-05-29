import { useState, useEffect } from 'react';
import { getAuthAxios } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Tag,
  Space,
  Input,
  Button,
  Typography,
  Spin,
  Alert,
  Modal,
  Avatar,
  Descriptions,
  Popconfirm,
  message,
  Form,
  Select,
  DatePicker
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Helper function to process image URLs
const processImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/static')) return url;
  return `https://nlife-backend-debug.onrender.com${url}`;
};

const AdminPatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchPatients();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('auth/me/');

      if (response.data) {
        const isAdmin = response.data.user_type === 'admin' || response.data.is_staff;
        setIsAdminLoggedIn(isAdmin);

        const userInfo = `${response.data.email} (${response.data.user_type})`;
        if (isAdmin) {
          message.success(`✅ Admin logged in: ${userInfo}`);
        } else {
          message.warning(`⚠️ Not admin: ${userInfo} - Click "Login as Admin" to delete patients`);
        }
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setIsAdminLoggedIn(false);
      message.error('Not logged in. Please click "Login as Admin" first.');
    }
  };

  const loginAsAdmin = async () => {
    try {
      message.loading('Logging in as admin...', 0);

      const response = await fetch('https://nlife-backend-debug.onrender.com/api/auth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@nlife.com',
          password: 'admin123'
        })
      });

      message.destroy(); // Clear loading message

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Verify the login worked
        try {
          const authAxios = getAuthAxios();
          const userResponse = await authAxios.get('auth/me/');
          if (userResponse.data.user_type === 'admin' || userResponse.data.is_staff) {
            message.success('✅ Successfully logged in as admin! You can now delete patients.');
          } else {
            message.warning('⚠️ Logged in but user is not admin');
          }
        } catch (verifyError) {
          message.error('Login verification failed');
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        message.error('Failed to login as admin. Check credentials.');
      }
    } catch (error) {
      message.destroy();
      console.error('Login error:', error);
      message.error('Login failed - network error');
    }
  };

  const checkAdminAccess = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('auth/me/');
      console.log('User data:', response.data);

      // For development purposes, allow all users to access admin pages
      // In production, uncomment the following code to restrict access
      /*
      if (!response.data.is_staff) {
        // Redirect non-admin users
        navigate('/');
        return;
      }
      */
    } catch (error) {
      console.error('Authentication error:', error);
      // For development, don't redirect to login
      // navigate('/login');
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('patients/');

      // Process the data
      let patientsData = [];
      if (Array.isArray(response.data)) {
        patientsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.results)) {
          patientsData = response.data.results;
        }
      }

      // Format the patients
      const formattedPatients = patientsData.map(patient => {

        // Extract patient name with multiple fallback strategies
        let patientName = 'Unknown Patient';

        // Strategy 1: Check if patient has user object
        if (patient.user && typeof patient.user === 'object') {
          const firstName = patient.user.first_name || patient.user.firstName || '';
          const lastName = patient.user.last_name || patient.user.lastName || '';
          patientName = `${firstName} ${lastName}`.trim();
          if (patientName === '') {
            patientName = patient.user.username || patient.user.email || 'Unknown Patient';
          }
        }
        // Strategy 2: Check if patient has direct name fields
        else if (patient.first_name || patient.last_name) {
          patientName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
        }
        // Strategy 3: Check if patient has a name field
        else if (patient.name) {
          patientName = patient.name;
        }
        // Strategy 4: Use email as fallback
        else if (patient.email) {
          patientName = patient.email.split('@')[0];
        }

        // Extract email with fallbacks
        let email = 'No email';
        if (patient.user?.email) {
          email = patient.user.email;
        } else if (patient.email) {
          email = patient.email;
        }

        // Extract phone with fallbacks
        let phone = 'No phone';
        if (patient.user?.phone_number) {
          phone = patient.user.phone_number;
        } else if (patient.user?.phone) {
          phone = patient.user.phone;
        } else if (patient.phone_number) {
          phone = patient.phone_number;
        } else if (patient.phone) {
          phone = patient.phone;
        }

        // Clean up phone display
        if (phone && phone !== 'No phone' && phone.trim() !== '') {
          phone = phone.trim();
        } else {
          phone = 'No phone';
        }

        // Extract gender with fallbacks
        let gender = 'Not specified';
        if (patient.user?.gender) {
          gender = patient.user.gender;
        } else if (patient.gender) {
          gender = patient.gender;
        }

        // Extract date of birth with fallbacks (Patient model first, then User model)
        let dateOfBirth = 'Not specified';
        if (patient.date_of_birth) {
          dateOfBirth = patient.date_of_birth;
        } else if (patient.user?.date_of_birth) {
          dateOfBirth = patient.user.date_of_birth;
        } else if (patient.dateOfBirth) {
          dateOfBirth = patient.dateOfBirth;
        }

        // Extract blood group with fallbacks (Patient model first, then User model)
        let bloodGroup = 'Not specified';
        if (patient.blood_group) {
          bloodGroup = patient.blood_group;
        } else if (patient.user?.blood_group) {
          bloodGroup = patient.user.blood_group;
        } else if (patient.bloodGroup) {
          bloodGroup = patient.bloodGroup;
        }

        // Extract emergency contact with fallbacks
        let emergencyContact = 'Not specified';
        if (patient.emergency_contact) {
          emergencyContact = patient.emergency_contact;
        } else if (patient.emergencyContact) {
          emergencyContact = patient.emergencyContact;
        }

        // Extract medical history with fallbacks
        let medicalHistory = 'None';
        if (patient.medical_history) {
          medicalHistory = patient.medical_history;
        } else if (patient.medicalHistory) {
          medicalHistory = patient.medicalHistory;
        }

        // Extract allergies with fallbacks
        let allergies = 'None';
        if (patient.allergies) {
          allergies = patient.allergies;
        }

        // Process profile picture with fallbacks
        let profilePic = '';
        if (patient.user?.profile_picture) {
          profilePic = processImageUrl(patient.user.profile_picture);
        } else if (patient.profile_picture) {
          profilePic = processImageUrl(patient.profile_picture);
        }

        const formattedPatient = {
          id: patient.id,
          name: patientName,
          email: email,
          phone: phone,
          gender: gender,
          dateOfBirth: dateOfBirth,
          bloodGroup: bloodGroup,
          emergencyContact: emergencyContact,
          medicalHistory: medicalHistory,
          allergies: allergies,
          profilePicture: profilePic,
          userId: patient.user?.id || patient.userId
        };

        return formattedPatient;
      });
      setPatients(formattedPatients);
      setError('');
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    editForm.setFieldsValue({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      bloodGroup: patient.bloodGroup,
      emergencyContact: patient.emergencyContact,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies
    });
    setShowEditModal(true);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      setDeleteLoading(patientId);

      // Check if we have a valid token
      const token = localStorage.getItem('access_token');
      if (!token) {
        message.error('Not logged in. Please click "Login as Admin" first.');
        return;
      }

      const authAxios = getAuthAxios();

      // Verify current user is admin before attempting delete
      try {
        const userResponse = await authAxios.get('auth/me/');
        if (!(userResponse.data.user_type === 'admin' || userResponse.data.is_staff)) {
          message.error('You must be logged in as admin to delete patients. Please click "Login as Admin".');
          return;
        }
      } catch (authError) {
        message.error('Authentication failed. Please click "Login as Admin".');
        return;
      }

      await authAxios.delete(`patients/${patientId}/`);
      message.success('Patient deleted successfully');
      fetchPatients(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.status === 403) {
        message.error('Permission denied. Please click "Login as Admin" button first.');
      } else if (error.response?.status === 404) {
        message.error('Patient not found');
      } else {
        message.error('Failed to delete patient. Please try again.');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      setEditLoading(true);
      const authAxios = getAuthAxios();

      // Split the data between User model and Patient model fields
      const [firstName, ...lastNameParts] = values.name.split(' ');
      const lastName = lastNameParts.join(' ');

      // User model fields
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email: values.email,
        phone_number: values.phone,
        gender: values.gender,
        date_of_birth: values.dateOfBirth,
        blood_group: values.bloodGroup
      };

      // Patient model fields
      const patientData = {
        emergency_contact: values.emergencyContact,
        medical_history: values.medicalHistory,
        allergies: values.allergies,
        date_of_birth: values.dateOfBirth,
        blood_group: values.bloodGroup
      };

      // Update User data first
      if (editingPatient.userId) {
        try {
          await authAxios.patch(`auth/users/${editingPatient.userId}/update/`, userData);
        } catch (userError) {
          console.error('Error updating user data:', userError);
          // Continue with patient update even if user update fails
        }
      }

      // Update Patient data
      const response = await authAxios.put(`patients/${editingPatient.id}/`, patientData);

      message.success('Patient updated successfully');

      // Update the local state with the combined data
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === editingPatient.id
            ? {
                ...patient,
                name: values.name,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                dateOfBirth: values.dateOfBirth,
                bloodGroup: values.bloodGroup,
                emergencyContact: values.emergencyContact,
                medicalHistory: values.medicalHistory,
                allergies: values.allergies
              }
            : patient
        )
      );

      setShowEditModal(false);
      setEditingPatient(null);
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating patient:', error);
      if (error.response?.status === 403) {
        message.error('You do not have permission to update patients');
      } else if (error.response?.status === 404) {
        message.error('Patient not found');
      } else if (error.response?.status === 400) {
        message.error('Invalid data provided. Please check your inputs.');
      } else {
        message.error('Failed to update patient. Please try again.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPatient(null);
    editForm.resetFields();
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchTermLower) ||
      patient.email.toLowerCase().includes(searchTermLower) ||
      patient.phone.toLowerCase().includes(searchTermLower) ||
      (patient.bloodGroup && patient.bloodGroup.toLowerCase().includes(searchTermLower))
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.profilePicture}
            style={{
              backgroundColor: record.profilePicture ? 'transparent' : '#6366F1'
            }}
          >
            {!record.profilePicture && text.charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Blood Group',
      dataIndex: 'bloodGroup',
      key: 'bloodGroup',
      render: (text) => {
        let color = 'default';
        if (text.includes('A')) color = 'blue';
        if (text.includes('B')) color = 'green';
        if (text.includes('AB')) color = 'purple';
        if (text.includes('O')) color = 'red';

        return text !== 'Not specified' ? <Tag color={color}>{text}</Tag> : text;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewPatientDetails(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditPatient(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Patient"
            description="Are you sure you want to delete this patient?"
            onConfirm={() => handleDeletePatient(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoading === record.id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <div style={{ display: 'flex', gap: '8px' }}>


          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchPatients}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search patients by name, email, phone..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary" onClick={fetchPatients}>
              Try Again
            </Button>
          }
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredPatients.map(item => ({ ...item, key: item.id }))}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: filteredPatients.length,
          onChange: paginate,
          showSizeChanger: false,
        }}
        loading={loading}
        bordered
        size="middle"
        locale={{ emptyText: 'No patients found' }}
      />

      {/* Patient Details Modal */}
      <Modal
        title="Patient Details"
        open={showModal}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedPatient && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <Avatar
                src={selectedPatient.profilePicture}
                size={64}
                style={{
                  backgroundColor: selectedPatient.profilePicture ? 'transparent' : '#6366F1'
                }}
              >
                {!selectedPatient.profilePicture && selectedPatient.name.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ margin: 0 }}>{selectedPatient.name}</Title>
                <Text type="secondary">{selectedPatient.email}</Text>
              </div>
            </div>

            <Descriptions
              title="Personal Information"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Phone">{selectedPatient.phone}</Descriptions.Item>
              <Descriptions.Item label="Gender">{selectedPatient.gender}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{selectedPatient.dateOfBirth}</Descriptions.Item>
              <Descriptions.Item label="Blood Group">{selectedPatient.bloodGroup}</Descriptions.Item>
              <Descriptions.Item label="Emergency Contact" span={2}>
                {selectedPatient.emergencyContact}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Medical Information"
              bordered
              column={1}
              style={{ marginTop: 24 }}
            >
              <Descriptions.Item label="Medical History">
                {selectedPatient.medicalHistory}
              </Descriptions.Item>
              <Descriptions.Item label="Allergies">
                {selectedPatient.allergies}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        title="Edit Patient"
        open={showEditModal}
        onCancel={closeEditModal}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter patient name' }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                {
                  pattern: /^[+]?[\d\s\-()]+$/,
                  message: 'Please enter a valid phone number'
                }
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select placeholder="Select Gender">
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[
                { required: true, message: 'Please enter date of birth' },
                {
                  pattern: /^\d{4}-\d{2}-\d{2}$/,
                  message: 'Please enter date in YYYY-MM-DD format'
                }
              ]}
            >
              <Input placeholder="Date of Birth (YYYY-MM-DD)" />
            </Form.Item>

            <Form.Item
              name="bloodGroup"
              label="Blood Group"
              rules={[{ required: true, message: 'Please select blood group' }]}
            >
              <Select placeholder="Select Blood Group">
                <Select.Option value="A+">A+</Select.Option>
                <Select.Option value="A-">A-</Select.Option>
                <Select.Option value="B+">B+</Select.Option>
                <Select.Option value="B-">B-</Select.Option>
                <Select.Option value="AB+">AB+</Select.Option>
                <Select.Option value="AB-">AB-</Select.Option>
                <Select.Option value="O+">O+</Select.Option>
                <Select.Option value="O-">O-</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="emergencyContact"
            label="Emergency Contact"
          >
            <Input placeholder="Emergency Contact" />
          </Form.Item>

          <Form.Item
            name="medicalHistory"
            label="Medical History"
          >
            <Input.TextArea rows={3} placeholder="Medical History" />
          </Form.Item>

          <Form.Item
            name="allergies"
            label="Allergies"
          >
            <Input.TextArea rows={2} placeholder="Allergies" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeEditModal} disabled={editLoading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Update Patient
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPatientsPage;
