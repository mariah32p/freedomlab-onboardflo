import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Users, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Eye,
  Send,
  Copy,
  Plus,
  Edit,
  Palette,
  Link as LinkIcon
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  component: React.ReactNode;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Demo data
  const [customers] = useState([
    { name: 'Sarah M.', company: 'TechCorp', email: 'sarah@techcorp.com', progress: 85, status: 'active' },
    { name: 'Mike R.', company: 'StartupXYZ', email: 'mike@startupxyz.com', progress: 100, status: 'completed' },
    { name: 'Lisa K.', company: 'GrowthCo', email: 'lisa@growthco.com', progress: 45, status: 'stuck' },
    { name: 'David L.', company: 'ScaleTech', email: 'david@scaletech.com', progress: 70, status: 'active' }
  ]);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const demoSteps: DemoStep[] = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      description: 'Real-time customer onboarding analytics',
      duration: 3000,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-sans">OnboardFlo Dashboard</h3>
                <p className="text-emerald-100 font-sans">Customer onboarding made simple</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-sans">87%</div>
                <div className="text-emerald-100 text-sm font-sans">Avg. Completion</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-sans">247</div>
                <div className="text-xs text-gray-600 font-sans">Active Users</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-sans">215</div>
                <div className="text-xs text-gray-600 font-sans">Completed</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-sans">2.3d</div>
                <div className="text-xs text-gray-600 font-sans">Avg. Time</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 font-sans">92%</div>
                <div className="text-xs text-gray-600 font-sans">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'create-checklist',
      title: 'Create Checklist',
      description: 'Build onboarding flows in minutes',
      duration: 4000,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 font-sans">Create New Checklist</h3>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center font-sans">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use Template
                </button>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center font-sans">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Checklist Title</label>
                <input 
                  type="text" 
                  value="SaaS Onboarding Checklist"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Description</label>
                <textarea 
                  value="Complete these steps to get started with our platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans"
                  rows={2}
                  readOnly
                />
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-medium text-emerald-900 mb-3 font-sans">Steps Preview</h4>
                <div className="space-y-2">
                  {['Account Setup', 'Project Requirements', 'Upload Brand Assets', 'Timeline Confirmation'].map((step, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span className="text-gray-700 font-sans">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'share-link',
      title: 'Share Customer Link',
      description: 'Generate trackable links for customers',
      duration: 3500,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 font-sans">Create Customer Link</h3>
            <p className="text-sm text-gray-600 font-sans">SaaS Onboarding Checklist</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                Link Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value="Sarah from TechCorp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans"
                readOnly
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-emerald-900 text-sm font-sans">Customer Link Created!</div>
                  <div className="text-xs text-emerald-700 font-sans">Ready to send to your customer</div>
                </div>
              </div>
              <div className="bg-white border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 font-mono text-sm text-gray-600">
                    onboardflo.com/c/abc123/xyz789
                  </div>
                  <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center font-sans">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'customer-progress',
      title: 'Track Progress',
      description: 'Monitor customer completion in real-time',
      duration: 4000,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 font-sans">Customer Submissions</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {customers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-sm font-bold font-sans">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 font-sans">{customer.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-sans">{customer.email}</span>
                            <span className="font-sans">{customer.company}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-sm font-medium font-sans ${
                            customer.status === 'completed' ? 'text-emerald-600' :
                            customer.status === 'stuck' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {customer.status === 'completed' ? 'Completed' :
                             customer.status === 'stuck' ? 'Needs Help' : 'In Progress'}
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  customer.status === 'completed' ? 'bg-emerald-500' :
                                  customer.status === 'stuck' ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ 
                                  width: `${currentStep >= 3 ? customer.progress : Math.min(customer.progress, animatedProgress)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700 font-sans">
                              {currentStep >= 3 ? customer.progress : Math.min(customer.progress, animatedProgress)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'customer-view',
      title: 'Customer Experience',
      description: 'Beautiful, mobile-friendly checklist interface',
      duration: 5000,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto">
          <div className="h-2 bg-emerald-500"></div>
          
          <div className="p-6 text-center bg-emerald-50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">SaaS Onboarding</h1>
            <p className="text-gray-600 font-sans">Complete these steps to get started</p>
            
            <div className="mt-4 max-w-xs mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
                <span className="text-sm font-medium text-gray-700 font-sans">
                  {completedSteps.length}/4 completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps.length / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { id: 'account', title: 'Account Setup', desc: 'Complete your profile and verify email' },
              { id: 'project', title: 'Project Requirements', desc: 'Tell us about your project goals' },
              { id: 'assets', title: 'Upload Brand Assets', desc: 'Share your logo and brand guidelines' },
              { id: 'timeline', title: 'Timeline Confirmation', desc: 'Review and confirm project timeline' }
            ].map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStep === 4 && index === completedSteps.length && !isCompleted;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : isActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 font-sans">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: 'branding',
      title: 'Brand Customization',
      description: 'Match your brand with custom colors and logos',
      duration: 3500,
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 font-sans">Brand Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Logo URL</label>
                <input
                  type="text"
                  value="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Primary Color</label>
                <div className="flex space-x-3 items-center">
                  <div className="w-12 h-10 bg-emerald-500 border border-gray-300 rounded-lg"></div>
                  <input
                    type="text"
                    value="#10b981"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Font Family</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans" disabled>
                  <option>Montserrat (Default)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 font-sans">Live Preview</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-2 bg-emerald-500"></div>
                <div className="p-6 text-center bg-emerald-50">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-xl">🚀</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2 font-sans">Your Branded Checklist</h1>
                  <p className="text-gray-600 font-sans">Matches your brand perfectly</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-emerald-500 rounded border-2 border-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 font-sans">Sample Step</div>
                      <div className="text-sm text-gray-600 font-sans">With your brand colors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Track performance and optimize your flows',
      duration: 3000,
      component: (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 font-sans">Analytics Dashboard</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 mb-1 font-sans">87%</div>
                <div className="text-sm text-emerald-700 font-sans">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1 font-sans">2.3</div>
                <div className="text-sm text-blue-700 font-sans">Avg Days to Complete</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 font-sans">Step Performance</h4>
              {[
                { step: 'Account Setup', completion: 95 },
                { step: 'Project Requirements', completion: 89 },
                { step: 'Upload Assets', completion: 72 },
                { step: 'Timeline Confirmation', completion: 85 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-sans">{item.step}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${currentStep >= 5 ? item.completion : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 font-sans">
                      {currentStep >= 5 ? item.completion : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
      } else {
        // Reset to beginning
        setCurrentStep(0);
        setProgress(0);
        setAnimatedProgress(0);
        setCompletedSteps([]);
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, demoSteps]);

  // Progress bar animation
  useEffect(() => {
    const duration = demoSteps[currentStep].duration;
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (isPlaying) {
        setProgress(prev => {
          const newProgress = prev + increment;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying, demoSteps]);

  // Animate customer progress
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setAnimatedProgress(85);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Animate customer checklist completion
  useEffect(() => {
    if (currentStep === 4) {
      const steps = ['account', 'project', 'assets', 'timeline'];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step]);
          if (index === 1) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2000);
          }
        }, (index + 1) * 1000);
      });
    } else {
      setCompletedSteps([]);
    }
  }, [currentStep]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 bg-emerald-50 border border-emerald-200 rounded-lg shadow-lg p-4 z-50 animate-slide-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium text-emerald-900 font-sans">Progress Update</div>
              <div className="text-sm text-emerald-700 font-sans">Sarah completed another step!</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-500 mr-2" />
            <span className="text-emerald-600 font-medium font-sans">Interactive Demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans">
            See OnboardFlo in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Watch how OnboardFlo transforms customer onboarding from chaos to clarity
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 font-sans">
                {demoSteps[currentStep].title}
              </h2>
              <p className="text-gray-600 font-sans">{demoSteps[currentStep].description}</p>
            </div>
            <button
              onClick={togglePlayPause}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors font-sans"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 bg-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Step Navigation */}
          <div className="flex space-x-2 overflow-x-auto">
            {demoSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                  currentStep === index
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="min-h-[600px] flex items-center justify-center">
          {demoSteps[currentStep].component}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sans">
            Ready to transform your onboarding?
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-sans">
            Start your 7-day free trial and see the difference organized onboarding makes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/signup'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center font-sans"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-300 transition-colors font-sans"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}