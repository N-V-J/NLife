import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Button, Dropdown, Avatar, Space, message } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import UserContext from '../../contexts/UserContext';

// No need for Layout components in this file

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { currentUser, logout, isAuthenticated } = useContext(UserContext);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleLogout = () => {
    logout();
    message.success('Successfully logged out');
  };

  // Define the gradient style for icons
  const gradientIconStyle = {
    fontSize: '16px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent'
  };

  // Define menu items
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined style={gradientIconStyle} />,
      label: <Link to="/">HOME</Link>,
    },
    {
      key: '/doctors',
      icon: <TeamOutlined style={gradientIconStyle} />,
      label: <Link to="/doctors">ALL DOCTORS</Link>,
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined style={gradientIconStyle} />,
      label: <Link to="/about">ABOUT</Link>,
    },
    {
      key: '/contact',
      icon: <PhoneOutlined style={gradientIconStyle} />,
      label: <Link to="/contact">CONTACT</Link>,
    },
  ];

  // User dropdown menu items
  const userMenuItems = {
    items: [
      {
        key: '1',
        icon: <UserOutlined style={gradientIconStyle} />,
        label: <Link to="/profile">Your Profile</Link>,
      },
      {
        key: '2',
        icon: <CalendarOutlined style={gradientIconStyle} />,
        label: <Link to="/my-appointments">My Appointments</Link>,
      },
      {
        key: '3',
        icon: <LogoutOutlined style={gradientIconStyle} />,
        label: 'Sign out',
        onClick: handleLogout,
      },
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        {/* Logo */}
        <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
            NLife
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{ border: 'none' }}
            items={menuItems}
          />

          <Space style={{ marginLeft: '20px' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: '#6366F1', marginRight: '8px' }}>
                  Welcome, {currentUser?.first_name || currentUser?.email || 'User'}!
                </span>
                <Dropdown menu={userMenuItems} placement="bottomRight" arrow>
                  <Avatar
                    style={{
                      cursor: 'pointer',
                      background: currentUser?.profile_picture ? 'transparent' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px solid #6366F1'
                    }}
                    src={currentUser?.profile_picture}
                    icon={!currentUser?.profile_picture && <UserOutlined style={{ color: 'white' }} />}
                    size="large"
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  style={{
                    marginRight: '8px',
                    borderColor: '#6366F1',
                    color: '#6366F1'
                  }}
                >
                  <Link to="/login" style={{ color: '#6366F1' }}>Login</Link>
                </Button>
                <Button
                  type="primary"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderColor: 'transparent',
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Link to="/register" style={{ color: 'white' }}>Create Account</Link>
                </Button>
              </>
            )}
          </Space>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button">
          <Button
            type="text"
            icon={<MenuOutlined style={{
              fontSize: '20px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }} />}
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuVisible && (
        <Menu
          mode="vertical"
          style={{ width: '100%' }}
          items={[
            ...menuItems,
            {
              key: '/profile',
              icon: <UserOutlined style={gradientIconStyle} />,
              label: <Link to="/profile">PROFILE</Link>,
            },
            {
              key: '/my-appointments',
              icon: <CalendarOutlined style={gradientIconStyle} />,
              label: <Link to="/my-appointments">MY APPOINTMENTS</Link>,
            },
            {
              key: '/login',
              icon: <UserOutlined style={gradientIconStyle} />,
              label: <Link to="/login">LOGIN</Link>,
              style: { marginTop: '10px' }
            },
            {
              key: '/register',
              icon: <UserOutlined style={gradientIconStyle} />,
              label: <Link to="/register">CREATE ACCOUNT</Link>,
            },
          ]}
        />
      )}
    </div>
  );
};

export default Navbar;
