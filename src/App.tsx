import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleHeader from './components/SimpleHeader';
import SimpleLandingPage from './pages/SimpleLandingPage';
import SimplePricingPage from './pages/SimplePricingPage';
import SimpleSignUpPage from './pages/SimpleSignUpPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <SimpleHeader />
        <main>
          <Routes>
            <Route path="/" element={<SimpleLandingPage />} />
            <Route path="/pricing" element={<SimplePricingPage />} />
            <Route path="/get-started" element={<SimpleSignUpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;