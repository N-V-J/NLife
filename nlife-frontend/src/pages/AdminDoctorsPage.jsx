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
  message
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Helper function to process image URLs
const processImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/static')) return url;
  return `https://nlife-backend-debug.onrender.com${url}`;
};

const AdminDoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const authAxios = getAuthAxios();
      console.log('Fetching doctors...');
      const response = await authAxios.get('doctors/');
      console.log('Doctors response:', response);

      // Process the data to ensure we have an array
      let doctorsData = [];

      if (Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Check if results property exists (common in Django REST Framework)
        if (Array.isArray(response.data.results)) {
          doctorsData = response.data.results;
        } else {
          // If it's an object but not in the expected format, convert to array
          doctorsData = Object.values(response.data).filter(item =>
            item && typeof item === 'object'
          );
        }
      }

      console.log('Processed doctors data:', doctorsData);

      // Format the doctors
      const formattedDoctors = doctorsData.map(doctor => {
        console.log('Processing doctor:', doctor);

        // Extract doctor name with fallbacks
        let doctorName = 'Unknown Doctor';
        if (doctor.user) {
          if (typeof doctor.user === 'object') {
            doctorName = ` ${doctor.user.first_name || ''} ${doctor.user.last_name || ''}`.trim();
            if (doctorName === 'Dr. ') doctorName = 'Unknown Doctor';
          }
        } else if (doctor.first_name || doctor.last_name) {
          doctorName = ` ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim();
          if (doctorName === 'Dr. ') doctorName = 'Unknown Doctor';
        }

        // Process profile picture
        let profilePic = '';
        if (doctor.user && doctor.user.profile_picture) {
          profilePic = processImageUrl(doctor.user.profile_picture);
        } else if (doctor.profile_picture) {
          profilePic = processImageUrl(doctor.profile_picture);
        }

        // Get specialty
        let specialty = 'Unknown Specialty';
        if (doctor.specialty) {
          if (typeof doctor.specialty === 'object') {
            specialty = doctor.specialty.name || 'Unknown Specialty';
          } else if (typeof doctor.specialty === 'string') {
            specialty = doctor.specialty;
          }
        }

        return {
          id: doctor.id,
          name: doctorName,
          email: doctor.user?.email || doctor.email || 'No email',
          specialty: specialty,
          experience: doctor.experience_years ? `${doctor.experience_years} years` : 'Not specified',
          education: doctor.education || 'Not specified',
          gender: doctor.gender || 'Not specified',
          bio: doctor.bio || 'No bio available',
          profilePicture: profilePic,
          consultationFee: doctor.consultation_fee ? `₹${doctor.consultation_fee}` : 'Not specified',
          availableDays: doctor.available_days || 'Not specified',
          startTime: doctor.start_time || 'Not specified',
          endTime: doctor.end_time || 'Not specified',
          userId: doctor.user?.id
        };
      });

      console.log('Formatted doctors:', formattedDoctors);
      setDoctors(formattedDoctors);
      setError('');
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleEditDoctor = (doctorId) => {
    navigate(`/admin/edit-doctor/${doctorId}`);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`doctors/${doctorId}/`);
      message.success('Doctor deleted successfully');
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error deleting doctor:', error);
      message.error('Failed to delete doctor');
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(searchTermLower) ||
      doctor.email.toLowerCase().includes(searchTermLower) ||
      doctor.specialty.toLowerCase().includes(searchTermLower) ||
      doctor.education.toLowerCase().includes(searchTermLower)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

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
      title: 'Doctor',
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
            {!record.profilePicture && text.charAt(3).toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Consultation Fee',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewDoctorDetails(record)}
            size="small"
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditDoctor(record.id)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDeleteDoctor(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
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
        <Title level={4}>Manage Doctors</Title>
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchDoctors}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/add-doctor')}
          >
            Add Doctor
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search doctors by name, email, specialty..."
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
            <Button size="small" type="primary" onClick={fetchDoctors}>
              Try Again
            </Button>
          }
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredDoctors.map(item => ({ ...item, key: item.id }))}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: filteredDoctors.length,
          onChange: paginate,
          showSizeChanger: false,
        }}
        loading={loading}
        bordered
        size="middle"
        locale={{ emptyText: 'No doctors found' }}
      />

      {/* Doctor Details Modal */}
      <Modal
        title="Doctor Details"
        open={showModal}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedDoctor && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <Avatar
                src={selectedDoctor.profilePicture}
                size={64}
                style={{
                  backgroundColor: selectedDoctor.profilePicture ? 'transparent' : '#6366F1'
                }}
              >
                {!selectedDoctor.profilePicture && selectedDoctor.name.charAt(3).toUpperCase()}
              </Avatar>
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ margin: 0 }}>{selectedDoctor.name}</Title>
                <Text type="secondary">{selectedDoctor.specialty}</Text>
              </div>
            </div>

            <Descriptions
              title="Professional Information"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Email">{selectedDoctor.email}</Descriptions.Item>
              <Descriptions.Item label="Gender">{selectedDoctor.gender}</Descriptions.Item>
              <Descriptions.Item label="Experience">{selectedDoctor.experience}</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedDoctor.education}</Descriptions.Item>
              <Descriptions.Item label="Consultation Fee">{selectedDoctor.consultationFee}</Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Schedule Information"
              bordered
              column={1}
              style={{ marginTop: 24 }}
            >
              <Descriptions.Item label="Available Days">
                {selectedDoctor.availableDays}
              </Descriptions.Item>
              <Descriptions.Item label="Working Hours">
                {selectedDoctor.startTime} - {selectedDoctor.endTime}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Bio"
              bordered
              column={1}
              style={{ marginTop: 24 }}
            >
              <Descriptions.Item>
                {selectedDoctor.bio}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDoctorsPage;
