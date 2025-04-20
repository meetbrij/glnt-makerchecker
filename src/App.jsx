import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MakerChecker from './pages/MakerChecker';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/maker-checker" element={<MakerChecker />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;