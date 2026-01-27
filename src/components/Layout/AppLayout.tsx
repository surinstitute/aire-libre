import { Outlet, useLocation } from 'react-router-dom';
import Bird3DCanvas from '../Bird/Bird3DCanvas';

export default function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {isHome && (
        <div style={{ display: 'none' }}>
          {/* Canvas oculto pero montado para precarga */}
          <Bird3DCanvas modelPath="/src/assets/models/birb.glb" />
        </div>
      )}
      <Outlet />
    </>
  );
}