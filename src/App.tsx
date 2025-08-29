import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ProblemSolution from './components/ProblemSolution';
import CTA from './components/CTA';
import PricingPage from './pages/PricingPage';
import SignInPage from './pages/SignInPage';
import GetStartedPage from './pages/GetStartedPage';

function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <CTA />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;