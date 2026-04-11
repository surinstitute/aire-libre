import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout.tsx';
import Home from './pages/Home.tsx';
import MapExplorer from './pages/MapExplorer.tsx';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult.tsx';
import FAQ from './pages/FAQ';
import Recommendations from './pages/Recommendations.tsx';
import Resources from './pages/Resources.tsx';
import Methodology from './pages/Methodology.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/resultado" element={<QuizResult />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/recomendaciones" element={<Recommendations />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/metodologia" element={<Methodology />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
