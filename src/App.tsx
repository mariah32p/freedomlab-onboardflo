import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import PricingPage from './pages/PricingPage';
import GetStartedPage from './pages/GetStartedPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './contexts/AuthContext';

// Simple landing page component that combines all sections
function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;