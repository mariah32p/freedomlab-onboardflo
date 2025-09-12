import React from 'react';
import { Menu, X, Workflow } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show full navigation for users with active subscriptions
  const accessStatus = getAccessStatus();
  const hasActiveSubscription = accessStatus.hasAccess;
  const showUserMenu = user && hasActiveSubscription && location.pathname !== '/reset-password';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Always navigate to home after sign out attempt
      navigate('/');
    } catch (err) {
      // Even if sign out fails, navigate away from protected pages
      console.error('Sign out error:', err);
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    if (showUserMenu) {
      navigate('/dashboard');
    } else {
      navigate('/');
      scrollToTop();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-50" style={{ minHeight: '60px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-sans">OnboardFlo</span>
            </button>
          </div>

          {/* Desktop Navigation and CTA */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {!user && (
                <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                  Login
                </Link>
              )}
              {showUserMenu && (
                <>
                  <Link to="/checklists" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Checklists
                  </Link>
                  <Link to="/submissions" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Sessions
                  </Link>
                  <Link to="/branding" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Branding
                  </Link>
                </>
              )}
              {showUserMenu && (
                <Link to="/settings" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                  Settings
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {showUserMenu ? (
                <>
                  <span className="text-gray-600 font-medium font-sans">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans"
                  >
                    Sign Out
                  </button>
                </>
              ) : user ? (
                // Logged in but no active subscription - show minimal menu
                <>
                  <span className="text-gray-600 font-medium font-sans">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Not logged in - show signup CTA
                <>
                  <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-sans">
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile CTA for non-user menu */}
          {!user && (
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors font-sans text-sm">
                Try Free
              </Link>
            </div>
          )}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !user && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Login
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center font-sans">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* User menu mobile navigation */}
        {isMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {/* Only show navigation links for users with active subscriptions */}
              {hasActiveSubscription && (
                <>
                  <Link to="/checklists" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Checklists
                  </Link>
                  <Link to="/submissions" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Sessions
                  </Link>
                  <Link to="/branding" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Branding
                  </Link>
                  <Link to="/settings" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                    Settings
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <span className="text-gray-600 font-medium font-sans">
                  {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-left font-medium font-sans"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}