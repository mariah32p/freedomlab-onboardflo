import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RouteGuard from './components/RouteGuard';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import DemoSection from './components/DemoSection';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import PricingPage from './pages/PricingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GetStartedPage from './pages/GetStartedPage';
import DashboardPage from './pages/DashboardPage';
import ChecklistsPage from './pages/ChecklistsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SettingsPage from './pages/SettingsPage';
import BrandingPage from './pages/BrandingPage';
import PublicChecklistPage from './pages/PublicChecklistPage';
import DemoPage from './pages/DemoPage';
import CreateChecklistPage from './pages/CreateChecklistPage';
import EditChecklistPage from './pages/EditChecklistPage';

// Simple landing page component that combines all sections
function LandingPage() {
  return (
    <>
      <Hero />
      <DemoSection />
      <Features />
      <SocialProof />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouteGuard>
          <Routes>
            {/* Public checklist submission - no navbar */}
            <Route path="/c/:checklistId/:sessionToken" element={<PublicChecklistPage />} />
            
            {/* Demo page with its own header */}
            <Route path="/demo" element={<DemoPage />} />
            
            {/* All other routes with navbar */}
            <Route path="/*" element={
              <div className="min-h-screen">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/get-started" element={<GetStartedPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/checklists" element={<ChecklistsPage />} />
                    <Route path="/checklists/create" element={<CreateChecklistPage />} />
                    <Route path="/checklists/edit/:checklistId" element={<EditChecklistPage />} />
                    <Route path="/submissions" element={<SubmissionsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/branding" element={<BrandingPage />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </RouteGuard>
      </Router>
    </AuthProvider>
  );
}

export default App;