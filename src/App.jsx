import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Personal from './pages/Personal';
import Habillement from './pages/Habillement';
import Masse from './pages/Masse';
import Parametres from './pages/Parametres';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-ios-background">
        <Header />
        <div className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<Personal />} />
            <Route path="/habillement" element={<Habillement />} />
            <Route path="/masse" element={<Masse />} />
            <Route path="/parametres" element={<Parametres />} />
          </Routes>
        </div>
        <Footer>
          <Menu />
        </Footer>
      </div>
    </Router>
  );
}

export default App;
