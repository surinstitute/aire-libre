import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapExplorer from './pages/MapExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapExplorer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;