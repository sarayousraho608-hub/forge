import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import SmartAssistant from './components/SmartAssistant';
import SecretPopup from './components/SecretPopup';
import GlobalEffects from './components/GlobalEffects';
import Home from './pages/Home';
import NothingPage from './pages/NothingPage';
import Prize from './pages/Prize';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GlobalEffects />
        <ScrollToHash />
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nothing" element={<NothingPage />} />
            <Route path="/prize" element={<Prize />} />
          </Routes>
        </div>
        <Footer />
        <SmartAssistant />
        <SecretPopup />
      </BrowserRouter>
    </AppProvider>
  );
}
