import { useState, useEffect } from 'react';
import { getAuthAxios } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Space, Input, Select, Button, Typography, Spin, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    checkAdminAccess();
    fetchAppointments();
  }, []);

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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const authAxios = getAuthAxios();
      console.log('Fetching appointments...');
      const response = await authAxios.get('appointments/');
      console.log('Appointments data:', response.data);

      // Process the data
      let appointmentsData = [];
      if (Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.results)) {
          appointmentsData = response.data.results;
        }
      }

      console.log('Processed appointments data:', appointmentsData);

      // Format the appointments
      const formattedAppointments = appointmentsData.map(appointment => {
        console.log('Processing appointment:', appointment);

        // Extract doctor and patient names with fallbacks
        let doctorName = 'Unknown Doctor';
        if (appointment.doctor) {
          if (typeof appointment.doctor === 'object' && appointment.doctor.user) {
            doctorName = `Dr. ${appointment.doctor.user.first_name || ''} ${appointment.doctor.user.last_name || ''}`.trim();
            if (doctorName === 'Dr. ') doctorName = 'Unknown Doctor';
          } else {
            doctorName = `Doctor #${appointment.doctor}`;
          }
        }

        let patientName = 'Unknown Patient';
        if (appointment.patient) {
          if (typeof appointment.patient === 'object' && appointment.patient.user) {
            patientName = `${appointment.patient.user.first_name || ''} ${appointment.patient.user.last_name || ''}`.trim();
            if (patientName === '') patientName = 'Unknown Patient';
          } else {
            patientName = `Patient #${appointment.patient}`;
          }
        }

        return {
          id: appointment.id,
          doctorName: doctorName,
          patientName: patientName,
          date: appointment.appointment_date || 'No date',
          time: appointment.appointment_time || 'No time',
          status: appointment.status || 'pending',
          paymentStatus: appointment.payment_status || 'unpaid',
          createdAt: appointment.created_at ? new Date(appointment.created_at).toLocaleDateString() : 'Unknown',
          doctorId: typeof appointment.doctor === 'object' ? appointment.doctor?.id : appointment.doctor,
          patientId: typeof appointment.patient === 'object' ? appointment.patient?.id : appointment.patient,
          reason: appointment.reason || 'Not specified'
        };
      });

      console.log('Formatted appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const authAxios = getAuthAxios();
      console.log(`Updating appointment ${appointmentId} status to ${newStatus}`);
      await authAxios.patch(`appointments/${appointmentId}/`, {
        status: newStatus
      });

      // Update local state
      setAppointments(appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      ));

      console.log(`Appointment status updated to ${newStatus}`);
      alert(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  const handlePaymentStatusChange = async (appointmentId, newStatus) => {
    try {
      const authAxios = getAuthAxios();
      console.log(`Updating appointment ${appointmentId} payment status to ${newStatus}`);
      await authAxios.patch(`appointments/${appointmentId}/`, {
        payment_status: newStatus
      });

      // Update local state
      setAppointments(appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, paymentStatus: newStatus }
          : appointment
      ));

      console.log(`Payment status updated to ${newStatus}`);
      alert(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  // Filter appointments based on search term and status filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date.includes(searchTerm) ||
      appointment.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#ECFDF5', text: '#059669' };
      case 'completed': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'cancelled': return { bg: '#FEF2F2', text: '#B91C1C' };
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  // Payment status color mapping
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return { bg: '#ECFDF5', text: '#059669' };
      case 'refunded': return { bg: '#FEF2F2', text: '#B91C1C' };
      case 'unpaid': return { bg: '#FEF3C7', text: '#D97706' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

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
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'confirmed') color = 'processing';
        if (status === 'completed') color = 'success';
        if (status === 'cancelled') color = 'error';
        if (status === 'pending') color = 'warning';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        let color = 'default';
        if (status === 'paid') color = 'success';
        if (status === 'refunded') color = 'error';
        if (status === 'unpaid') color = 'warning';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <Select
            defaultValue={record.paymentStatus}
            style={{ width: 120 }}
            onChange={(value) => handlePaymentStatusChange(record.id, value)}
            options={[
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'paid', label: 'Paid' },
              { value: 'refunded', label: 'Refunded' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>Manage Appointments</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchAppointments}
        >
          Refresh
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search appointments..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
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
            <Button size="small" type="primary" onClick={fetchAppointments}>
              Try Again
            </Button>
          }
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredAppointments.map(item => ({ ...item, key: item.id }))}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: filteredAppointments.length,
          onChange: paginate,
          showSizeChanger: false,
        }}
        loading={loading}
        bordered
        size="middle"
        locale={{ emptyText: 'No appointments found' }}
      />
    </div>
  );
};

export default AdminAppointmentsPage;
