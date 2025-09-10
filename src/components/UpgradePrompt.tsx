import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  inline?: boolean;
  className?: string;
}

export default function UpgradePrompt({ 
  feature, 
  description, 
  inline = false,
  className = '' 
}: UpgradePromptProps) {
  const { createCheckoutSession, loading } = useStripe();

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession('price_1RzrMYDn6VTzl81bTSgcl0ZA', 'subscription'); // Pro plan
    } catch (err) {
      console.error('Failed to start upgrade:', err);
    }
  };

  if (inline) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-500 font-sans">
          {feature} requires Pro
        </span>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium underline font-sans disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Upgrade'}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
            {feature} - Pro Feature
          </h3>
          <p className="text-gray-600 mb-4 font-sans">
            {description || `${feature} is available on the Pro plan. Upgrade to unlock this feature and many more.`}
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center disabled:opacity-50 font-sans"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}