import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Workflow, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await resetPassword(email);

      if (authError) {
        setError(authError.message);
      } else {
        setEmailSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
              Check your email
            </h2>
            <p className="text-gray-600 mb-8 font-sans">
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in the email to reset your password.
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/signin"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors font-sans"
              >
                Back to Sign In
              </Link>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-sans"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            Reset your password
          </h2>
          <p className="text-gray-600 font-sans">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-sans">{error}</p>
            </div>
          )}
          
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors font-sans disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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