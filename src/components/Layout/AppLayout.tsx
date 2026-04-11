import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function AppLayout() {
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isMap = location.pathname === '/map';
  const isQuizResult = location.pathname === '/quiz/resultado';
  const isQuiz = location.pathname === '/quiz';

  useEffect(() => {
    if (isMap || isQuizResult) return;

    const headerEl = headerRef.current;
    if (!headerEl) return;

    const root = document.documentElement;
    const updateHeaderHeight = () => {
      const height = Math.ceil(headerEl.getBoundingClientRect().height);
      root.style.setProperty('--header-height', `${height}px`);
    };

    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(headerEl);
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [isMap, isQuizResult]);

  // Map has its own integrated header; quiz results are full-screen slides
  if (isMap || isQuizResult) return <Outlet />;

  // Quiz has its own fixed footer (Atrás/Siguiente), don't show the general Footer
  const showFooter = !isQuiz;

  return (
    <>
      <style>{`
        :root {
          --header-height: 80px;
        }
        @media (max-width: 900px) {
          :root {
            --header-height: 62px;
          }
        }
        @media (max-width: 600px) {
          :root {
            --header-height: 56px;
          }
        }
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .app-content {
          padding-top: var(--header-height);
          min-height: calc(100vh - var(--header-height));
        }
      `}</style>
      <div className="app-header" ref={headerRef}>
        <NavBar variant="transparent" />
      </div>
      <div className="app-content">
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </>
  );
}