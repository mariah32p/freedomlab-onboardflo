import React from 'react';
import { Menu, X, Workflow } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showUserMenu = user && location.pathname !== '/reset-password';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            {/* Mobile hamburger menu */}
            {!showUserMenu && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-2"
               style={{ width: '120px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            )}
            <button onClick={handleLogoClick} className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-sans" style={{ maxWidth: '120px' }}>OnboardFlo</span>
            </button>
          </div>

          {/* Desktop Navigation and CTA */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {!showUserMenu && (
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
                    Submissions
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
              ) : (
                <>
                  <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-semibold transition-colors font-sans" style={{ width: '160px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile CTA for non-user menu */}
          {!showUserMenu && (
            <div className="md:hidden">
              <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-md font-semibold transition-colors font-sans text-sm">
                Try Free
              </Link>
            </div>
          )}
          {showUserMenu && (
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
        {isMenuOpen && !showUserMenu && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Login
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/signup" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-semibold transition-colors text-center font-sans" style={{ width: '90%', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* User menu mobile navigation */}
        {isMenuOpen && showUserMenu && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/checklists" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Checklists
              </Link>
              <Link to="/submissions" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Submissions
              </Link>
              <Link to="/branding" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Branding
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 transition-colors font-medium font-sans">
                Settings
              </Link>
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