import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Avatar } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, adminUser } = useAuth();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/appointments',
      icon: <CalendarOutlined />,
      label: <Link to="/admin/appointments">Appointments</Link>,
    },
    {
      key: '/admin/add-doctor',
      icon: <UserAddOutlined />,
      label: <Link to="/admin/add-doctor">Add Doctor</Link>,
    },
    {
      key: '/admin/doctors',
      icon: <TeamOutlined />,
      label: <Link to="/admin/doctors">Doctors List</Link>,
    },
    {
      key: '/admin/patients',
      icon: <UserOutlined />,
      label: <Link to="/admin/patients">Patients</Link>,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10
        }}
        width={250}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          height: '70px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(to right, #6366F1, #8B5CF6)'
        }}>
          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Avatar
              style={{
                backgroundColor: 'white',
                marginRight: collapsed ? '0' : '12px',
                color: '#6366F1',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              icon={<UserOutlined />}
              size={40}
            />
            {!collapsed && (
              <Title level={4} style={{ margin: 0, color: 'white' }}>
                NLife <span style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>Admin</span>
              </Title>
            )}
          </Link>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            borderRight: 0,
            marginTop: '16px',
            fontWeight: 500
          }}
          items={menuItems}
        />

        {!collapsed && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            marginTop: 'auto',
            background: '#f9fafb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Avatar
                style={{ backgroundColor: '#6366F1', marginRight: '8px' }}
                size="small"
              >
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Text strong style={{ fontSize: '14px' }}>{adminUser?.email || 'Admin User'}</Text>
            </div>
            <Button
              type="default"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              style={{ width: '100%', borderRadius: '4px' }}
            >
              Logout
            </Button>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
          zIndex: 9,
          height: '70px'
        }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#111827' }}>
              {location.pathname.includes('/dashboard') ? 'Dashboard' :
               location.pathname.includes('/appointments') ? 'Appointments' :
               location.pathname.includes('/doctors') ? 'Doctors' :
               location.pathname.includes('/add-doctor') ? 'Add Doctor' :
               location.pathname.includes('/patients') ? 'Patients' : 'Admin Panel'}
            </Title>
          </div>

          {collapsed && (
            <Button
              type="primary"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              style={{ borderRadius: '4px' }}
            >
              Logout
            </Button>
          )}
        </Header>

        <Content style={{
          margin: '24px 16px',
          padding: { xs: 12, sm: 16, md: 24 },
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          minHeight: 280
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
