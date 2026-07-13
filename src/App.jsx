import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import TeamPage from './pages/TeamPage';
import BackgroundBlobs from './components/BackgroundBlobs';
import AchievementsPage from './pages/AchievementsPage';
import ApplyPage from './pages/ApplyPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen" >
        <BackgroundBlobs />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/apply" element={<ApplyPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

