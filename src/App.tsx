import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapExplorer from './pages/MapExplorer';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapExplorer />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/resultado" element={<QuizResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
