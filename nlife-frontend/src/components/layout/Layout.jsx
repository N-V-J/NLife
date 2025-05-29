import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminNavbar from '../admin/AdminNavbar';

const { Header, Content, Footer: AntFooter } = AntLayout;

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <Navbar />
      </Header>
      {isAdminPage && <AdminNavbar />}
      <Content style={{
        padding: '0 20px',
        marginTop: isAdminPage ? 0 : 16
      }}>
        <div className="site-layout-content responsive-container">
          <Outlet />
        </div>
      </Content>
      <AntFooter style={{ textAlign: 'center' }}>
        <Footer />
      </AntFooter>
    </AntLayout>
  );
};

export default Layout;
