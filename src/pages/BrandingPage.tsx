import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Palette, Upload, Eye, Save, RotateCcw } from 'lucide-react';

interface UserBranding {
  id: string;
  user_id: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  created_at: string;
  updated_at: string;
}

const FONT_OPTIONS = [
  { value: 'Montserrat', label: 'Montserrat (Default)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
];

const PRESET_COLORS = [
  { name: 'OnboardFlo Default', primary: '#10b981', secondary: '#059669' },
  { name: 'Ocean Blue', primary: '#0066cc', secondary: '#00a8ff' },
  { name: 'Forest Green', primary: '#2d5a27', secondary: '#4caf50' },
  { name: 'Sunset Orange', primary: '#e65100', secondary: '#ff9800' },
  { name: 'Royal Purple', primary: '#4a148c', secondary: '#9c27b0' },
  { name: 'Crimson Red', primary: '#b71c1c', secondary: '#f44336' },
];

export default function BrandingPage() {
  const { user } = useAuth();
  const { loading, getAccessStatus } = useSubscription();
  const navigate = useNavigate();
  const [branding, setBranding] = useState<UserBranding | null>(null);
  const [brandingLoading, setBrandingLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [secondaryColor, setSecondaryColor] = useState('#059669');
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [businessName, setBusinessName] = useState('');

  const accessStatus = getAccessStatus();

  // Redirect to dashboard if no active subscription
  useEffect(() => {
    if (!loading && (!accessStatus.hasAccess || accessStatus.shouldRedirectToGetStarted)) {
      navigate('/dashboard');
    }
  }, [loading, accessStatus, navigate]);

  useEffect(() => {
    fetchBranding();
  }, [user]);

  const fetchBranding = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_branding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setBranding(data);
        setLogoUrl(data.logo_url || '');
        setPrimaryColor(data.primary_color);
        setSecondaryColor(data.secondary_color);
        setFontFamily(data.font_family);
        setBusinessName(data.business_name || '');
      }
      
      setBrandingLoading(false);
    } catch (error) {
      console.error('Error fetching branding:', error);
      setError('Failed to load branding settings');
      setBrandingLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const brandingData = {
        user_id: user.id,
        logo_url: logoUrl.trim() || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
        business_name: businessName.trim(),
      };

      const { data, error } = await supabase
        .from('user_branding')
        .upsert(brandingData, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;

      setBranding(data);
      setSuccess('Branding settings saved successfully!');
    } catch (error) {
      console.error('Error saving branding:', error);
      setError('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLogoUrl('');
    setPrimaryColor('#10b981');
    setSecondaryColor('#059669');
    setFontFamily('Montserrat');
    setBusinessName('');
  };

  const applyPreset = (preset: typeof PRESET_COLORS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setLogoUrl(base64);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to process image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  if (brandingLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Brand Settings</h1>
              <p className="text-gray-600 font-sans">Customize the appearance of your onboarding checklists</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-sans">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-600 text-sm font-sans">{success}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Logo URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                        placeholder="https://example.com/logo.png"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              <span>Upload</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      Enter a URL or upload an image file (PNG, JPG, or SVG recommended, max 2MB)
                    </p>
                  </div>

                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                      Color Presets
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.secondary }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700 font-sans">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Primary Color
                    </label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                        placeholder="#10b981"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-sans">Used for headers and primary elements</p>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Secondary Color
                    </label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                        placeholder="#059669"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-sans">Used for buttons and accents</p>
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                      placeholder="Your Business Name"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      Used in email communications to customers
                    </p>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-sans"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-sans"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 font-sans">Live Preview</h3>
                  </div>
                </div>

                {/* Checklist Preview */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  {/* Header with brand color */}
                  <div 
                    className="h-3 w-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  
                  <div 
                    className="px-6 py-8 text-center"
                    style={{ 
                      backgroundColor: `${primaryColor}10`,
                      fontFamily: fontFamily 
                    }}
                  >
                    {logoUrl && (
                      <div className="flex justify-center mb-4">
                        <img 
                          src={logoUrl} 
                          alt="Logo" 
                          className="h-12 max-w-48 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">SaaS Onboarding Checklist</h1>
                    <p className="text-gray-600">Complete these steps to get started with our platform</p>
                  </div>

                  <div className="p-6 space-y-4" style={{ fontFamily: fontFamily }}>
                    {/* Sample checklist steps */}
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div 
                        className="w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5"
                        style={{ borderColor: primaryColor, backgroundColor: primaryColor }}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Account Setup</h4>
                        <p className="text-sm text-gray-600 mt-1">Complete your profile and verify your email</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <div 
                        className="w-5 h-5 rounded border-2 mt-0.5"
                        style={{ borderColor: primaryColor }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Project Requirements</h4>
                        <p className="text-sm text-gray-600 mt-1">Tell us about your project goals and requirements</p>
                        <input 
                          type="text" 
                          placeholder="Describe your project..."
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                      <div 
                        className="w-5 h-5 rounded border-2 mt-0.5"
                        style={{ borderColor: primaryColor }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Upload Brand Assets</h4>
                        <p className="text-sm text-gray-600 mt-1">Share your logo and brand guidelines</p>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-500">Drop files here or click to upload</p>
                        </div>
                      </div>
                    </div>

                    {/* Sample button */}
                    <button
                      type="button"
                      className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors mt-6"
                      style={{ 
                        backgroundColor: secondaryColor,
                        fontFamily: fontFamily 
                      }}
                    >
                      Submit Onboarding Info
                    </button>
                  </div>
                </div>

                {/* Color Palette Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 font-sans">Current Color Palette</h4>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 mb-2"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <div className="text-xs text-gray-600 font-sans">Primary</div>
                      <div className="text-xs font-mono text-gray-500">{primaryColor}</div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 mb-2"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <div className="text-xs text-gray-600 font-sans">Secondary</div>
                      <div className="text-xs font-mono text-gray-500">{secondaryColor}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}