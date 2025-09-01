import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Workflow, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { updatePassword, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Check if user has a valid session (came from email link)
  useEffect(() => {
    if (!authLoading && !session && !showConfirmation && !loading) {
      navigate('/signin');
    }
  }, [authLoading, session, showConfirmation, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      setLoading(false);
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await updatePassword(formData.password);

      if (authError) {
        setError(authError.message);
      } else {
        setShowConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinueToSignIn = () => {
    navigate('/signin');
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-sans whitespace-nowrap">OnboardFlo</span>
            </Link>
            
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">
              Password updated successfully!
            </h2>
            <p className="text-gray-600 mb-8 font-sans">
              Your password has been changed. You can now sign in with your new password.
            </p>
            
            <button 
              onClick={handleContinueToSignIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors font-sans"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 font-sans">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 font-sans whitespace-nowrap">OnboardFlo</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-sans">
            Set new password
          </h2>
          <p className="text-gray-600 font-sans">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-sans">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                New password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Enter new password"
                />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600 font-sans">
                <p className="mb-1">Password must contain:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                    One number
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Confirm new password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Confirm new password"
                />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors font-sans disabled:opacity-50"
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/signin" 
              className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 font-sans"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}