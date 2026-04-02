import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function AppLayout() {
  const location = useLocation();
  const isMap = location.pathname === '/map';
  const isQuizResult = location.pathname === '/quiz/resultado';

  // Map has its own integrated header; quiz results are full-screen slides
  if (isMap || isQuizResult) return <Outlet />;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
      }}>
        <NavBar variant="transparent" />
      </div>
      <div style={{ paddingTop: 64 }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}