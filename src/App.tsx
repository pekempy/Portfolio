import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Reels } from './pages/Reels';
import { HeadshotResume } from './pages/HeadshotResume';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Work } from './pages/Work';
import { WorkDetail } from './pages/WorkDetail';
import { Login } from './pages/Login';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="reels" element={<Reels />} />
          <Route path="resume" element={<HeadshotResume />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<WorkDetail />} />
          <Route path="login-page" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
