import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Workflow } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

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

    try {
      const { error: authError } = await signUp(formData.email, formData.password);

      if (authError) {
        setError(authError.message);
      } else {
        navigate('/get-started');
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 font-sans whitespace-nowrap">OnboardFlo</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-sans mt-8">
            Start your free trial
          </h2>
          <p className="text-gray-600 font-sans">
            Create your account and get started in minutes
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-sans">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Password
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
                  placeholder="Create a password"
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
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors font-sans disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 font-sans">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-emerald-600 hover:text-emerald-500 font-sans">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Trust indicators */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-sans">
            ✓ 7-day free trial • ✓ Setup in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}