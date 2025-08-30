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
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  Mail,
  Building,
  User,
  Check,
  AlertCircle,
  TrendingUp,
  Calendar,
  RotateCcw,
  Upload
} from 'lucide-react';
import DemoHeader from '../components/DemoHeader';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ users: 0, completed: 0, rate: 0, days: 0 });
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});
  const [activityItems, setActivityItems] = useState([
    { user: 'Emma W.', action: 'uploaded brand assets', time: '5 min ago', type: 'success' },
    { user: 'Alex P.', action: 'completed requirements', time: '12 min ago', type: 'success' },
    { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
    { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' }
  ]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showNewActivity, setShowNewActivity] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Real-time customer onboarding analytics and activity feed',
      duration: 4000,
    },
    {
      id: 'checklists',
      title: 'Checklist Management',
      description: 'Create and manage onboarding flows with templates',
      duration: 4000,
    },
    {
      id: 'submissions',
      title: 'Customer Submissions',
      description: 'Track customer progress and manage submissions',
      duration: 4000,
    },
    {
      id: 'customer-view',
      title: 'Customer Experience',
      description: 'Beautiful, mobile-friendly checklist interface',
      duration: 4000,
    },
    {
      id: 'branding',
      title: 'Brand Customization',
      description: 'Customize colors, fonts, and logos to match your brand',
      duration: 4000,
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
        setAnimatedStats({ users: 0, completed: 0, rate: 0, days: 0 });
        setAnimatedProgress({});
        setShowNewActivity(false);
        // Move to next slide more quickly after new activity appears
        setTimeout(() => {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setProgress(0);
          }
        }, 800);
        setActivityItems([
          { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
          { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' },
          { user: 'David L.', action: 'completed step 3', time: '2 hours ago', type: 'success' }
        ]);
        setCompletedSteps([]);
      }
    }, demoSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, demoSteps]);

  // Progress bar animation
  useEffect(() => {
    const duration = demoSteps[currentStep].duration;
    const interval = 50;
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

  // Step-specific animations
  useEffect(() => {
    // Reset animations when step changes
    setAnimatedStats({ users: 0, completed: 0, rate: 0, days: 0 });
    setAnimatedProgress({});
    setActivityItems([
      { user: 'Emma W.', action: 'uploaded brand assets', time: '5 min ago', type: 'success' },
      { user: 'Alex P.', action: 'completed requirements', time: '12 min ago', type: 'success' },
      { user: 'Mike R.', action: 'started onboarding', time: '15 min ago', type: 'info' },
      { user: 'Lisa K.', action: 'needs assistance', time: '1 hour ago', type: 'warning' }
    ]);
    setCompletedSteps([]);
    setShowNewActivity(false);

    if (currentStep === 0) {
      // Dashboard animations
      setTimeout(() => {
        setAnimatedStats({ users: 247, completed: 215, rate: 87, days: 2.3 });
      }, 500);
      
      setTimeout(() => {
        setShowNewActivity(true);
        setTimeout(() => {
          setActivityItems(prev => [
            { user: 'Sarah M.', action: 'completed setup', time: '2 min ago', type: 'success' },
            ...prev
          ]);
          setShowNewActivity(false);
        }, 500);
      }, 2000);
    } else if (currentStep === 2) {
      // Submissions page animations
      setTimeout(() => {
        setAnimatedProgress({
          'sarah': 85,
          'mike': 100,
          'lisa': 45,
          'david': 70
        });
      }, 1000);
    } else if (currentStep === 3) {
      // Customer view animations
      const steps = ['slack', 'logo', 'brand'];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step]);
        }, (index + 1) * 1000);
      });
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

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Dashboard</h1>
        <p className="text-gray-600 font-sans">Overview of your onboarding performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.users}</div>
              <div className="text-sm text-gray-600 font-sans">Active Customers</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.rate}%</div>
              <div className="text-sm text-gray-600 font-sans">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">{animatedStats.days}</div>
              <div className="text-sm text-gray-600 font-sans">Avg Days</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">12</div>
              <div className="text-sm text-gray-600 font-sans">Need Help</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-sans">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* New activity notification sliding in from right */}
            {showNewActivity && (
              <div className="flex items-start animate-slide-in">
                <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-sans">
                    <span className="font-medium">Sarah M.</span> completed setup
                  </p>
                  <p className="text-xs text-gray-500 font-sans">2 min ago</p>
                </div>
              </div>
            )}
            {activityItems.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start"
              >
                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-sans">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 font-sans">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklists = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Your Checklists</h2>
          <p className="text-gray-600 font-sans">Create and manage onboarding flows for your customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center shadow-sm hover:shadow-md font-sans">
            <Sparkles className="w-5 h-5 mr-2" />
            Use Template
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center shadow-sm hover:shadow-md font-sans">
            <Plus className="w-5 h-5 mr-2" />
            Create Custom
          </button>
        </div>
      </div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            title: 'Website Design Onboarding',
            description: 'Initial client onboarding for new website design projects including requirements gathering and asset collection.',
            steps: 8,
            sessions: 12,
            completion: 92,
            color: '#10b981'
          },
          {
            title: 'Website Design Feedback & Approval',
            description: 'Structured feedback collection and approval process for design iterations and revisions.',
            steps: 5,
            sessions: 18,
            completion: 88,
            color: '#3b82f6'
          },
          {
            title: 'Website Design Offboarding',
            description: 'Project completion checklist including final deliverables, training, and handover documentation.',
            steps: 6,
            sessions: 9,
            completion: 94,
            color: '#8b5cf6'
          }
        ].map((checklist, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div 
              className="h-2 rounded-t-xl"
              style={{ backgroundColor: checklist.color }}
            ></div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 font-sans mb-3">
                  {checklist.title}
                </h3>
                <p className="text-gray-600 font-sans leading-relaxed">
                  {checklist.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 font-sans">{checklist.steps}</div>
                  <div className="text-xs text-gray-600 font-sans">Steps</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 font-sans">{checklist.sessions}</div>
                  <div className="text-xs text-gray-600 font-sans">Sessions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 font-sans">{checklist.completion}%</div>
                  <div className="text-xs text-gray-600 font-sans">Completed</div>
                </div>
              </div>

              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors mb-4 font-sans">
                Create Customer Link
              </button>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 font-sans">
                  Jan 15, 2025
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Customer Submissions</h1>
        <p className="text-gray-600 font-sans">Track customer progress across all your onboarding checklists</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">44</div>
              <div className="text-sm text-gray-600 font-sans">Total Links</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">8</div>
              <div className="text-sm text-gray-600 font-sans">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">15</div>
              <div className="text-sm text-gray-600 font-sans">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 font-sans">21</div>
              <div className="text-sm text-gray-600 font-sans">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-sans">Customer Sessions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { 
                name: 'Sarah Mitchell', 
                email: 'sarah@techflow.com', 
                company: 'TechFlow Inc', 
                checklist: 'Website Design Onboarding',
                status: 'started', 
                progress: 85, 
                linkName: 'Corporate Website Redesign',
                created: 'Jan 15, 2025 2:14 PM',
                lastActivity: '5 min ago'
              },
              { 
                name: 'Michael Rodriguez', 
                email: 'mike@datavault.io', 
                company: 'DataVault', 
                checklist: 'Website Design Feedback & Approval',
                status: 'completed', 
                progress: 100, 
                linkName: 'Homepage Feedback Round 2',
                created: 'Jan 14, 2025 10:30 AM',
                lastActivity: '2 hours ago'
              },
              { 
                name: 'Lisa Chen', 
                email: 'lisa@growthco.com', 
                company: 'GrowthCo', 
                checklist: 'Website Design Offboarding',
                status: 'started', 
                progress: 45, 
                linkName: 'Final Deliverables & Training',
                created: 'Jan 14, 2025 4:22 PM',
                lastActivity: '1 hour ago'
              },
              { 
                name: 'David Thompson', 
                email: 'david@scaletech.ai', 
                company: 'ScaleTech AI', 
                checklist: 'Website Design Onboarding',
                status: 'started', 
                progress: 70, 
                linkName: 'E-commerce Platform Setup',
                created: 'Jan 13, 2025 11:45 AM',
                lastActivity: '30 min ago'
              }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-sm font-bold font-sans">
                      {session.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 font-sans">{session.name}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                            {session.linkName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="font-sans">{session.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            <span className="font-sans">{session.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="font-sans">Checklist: {session.checklist}</span>
                          <span className="font-sans">Created: {session.created}</span>
                          <span className="font-sans">Last activity: {session.lastActivity}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-sm font-medium font-sans ${
                          session.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {session.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                        {session.status === 'completed' ? (
                          <div className="text-xs text-emerald-600 mt-1 font-sans font-medium">
                            100% complete
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1 font-sans">
                            {animatedProgress[session.name.split(' ')[0].toLowerCase()] || 0}% complete
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="h-2 bg-emerald-500"></div>
        
        <div className="px-6 py-8 text-center bg-emerald-50">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Website Design Project</h1>
          <p className="text-gray-600 text-lg font-sans">Complete these steps to start your website design project</p>
          
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 font-sans">Progress</span>
              <span className="text-sm font-medium text-gray-700 font-sans">
                {completedSteps.length}/7 completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / 7) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-emerald-600 font-sans">
                {Math.round((completedSteps.length / 7) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {[
            { 
              id: 'slack', 
              title: 'Join Project Slack', 
              desc: 'Accept invitation to our design team workspace',
              type: 'checkbox'
            },
            { 
              id: 'logo', 
              title: 'Upload Logo & Brand Assets', 
              desc: 'Share your current logo, brand guidelines, and any existing materials',
              type: 'file_upload'
            },
            { 
              id: 'brand', 
              title: 'Brand Requirements & Vision', 
              desc: 'Tell us about your brand personality, target audience, and design preferences',
              type: 'textarea'
            },
            { 
              id: 'contact', 
              title: 'Primary Contact Information', 
              desc: 'Who should we contact for design feedback and approvals?',
              type: 'email'
            },
            { 
              id: 'inspiration', 
              title: 'Design Inspiration Links', 
              desc: 'Share websites or designs you love for style reference',
              type: 'url'
            },
            { 
              id: 'timeline', 
              title: 'Project Timeline', 
              desc: 'When do you need the website completed?',
              type: 'text'
            },
            { 
              id: 'kickoff', 
              title: 'Schedule Kickoff Meeting', 
              desc: 'Book a 60-minute strategy session to discuss your project in detail',
              type: 'checkbox'
            }
          ].map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = index === completedSteps.length && !isCompleted;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-blue-50 border border-blue-200' : 
                  isCompleted ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 font-sans">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 font-sans">{step.desc}</p>
                  {isActive && step.type === 'textarea' && (
                    <textarea 
                      placeholder="Tell us about your brand vision, target audience, and design style preferences..."
                      className="w-full mt-3 px-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      rows={3}
                    />
                  )}
                  {isActive && step.type === 'text' && (
                    <input 
                      type="text" 
                      placeholder="e.g., March 15, 2025"
                      className="w-full mt-3 px-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  )}
                  {isActive && step.type === 'email' && (
                    <div className="mt-3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="contact@yourcompany.com"
                        className="w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  )}
                  {isActive && step.type === 'url' && (
                    <div className="mt-3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="url" 
                        placeholder="https://example.com/inspiration"
                        className="w-full pl-10 pr-3 py-3 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  )}
                  {isActive && step.type === 'file_upload' && (
                    <div className="mt-3 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50">
                      <Upload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-blue-600 text-sm font-medium font-sans mb-1">
                        Drop files here or click to upload
                      </div>
                      <div className="text-xs text-blue-500 font-sans">
                        PNG, JPG, PDF, AI files accepted
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Brand Settings</h1>
            <p className="text-gray-600 font-sans">Customize the appearance of your onboarding checklists</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Logo</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value="https://example.com/logo.png"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                    placeholder="https://example.com/logo.png"
                    readOnly
                  />
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-sans">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">Color Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'OnboardFlo Default', primary: '#10b981', secondary: '#059669' },
                    { name: 'Ocean Blue', primary: '#0066cc', secondary: '#00a8ff' },
                    { name: 'Forest Green', primary: '#2d5a27', secondary: '#4caf50' }
                  ].map((preset, index) => (
                    <button
                      key={preset.name}
                      className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left ${
                        index === 0 ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                      }`}
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
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 font-sans">Live Preview</h3>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="h-3 w-full bg-emerald-500"></div>
                
                <div className="px-6 py-8 text-center bg-emerald-50">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop" 
                      alt="DesignStudio Pro Logo" 
                      className="h-12 w-24 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-900 font-sans">SaaS Onboarding Checklist</h1>
                  <p className="text-gray-600 font-sans">Complete these steps to get started with our platform</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 font-sans">Account Setup</h4>
                      <p className="text-sm text-gray-600 mt-1 font-sans">Complete your profile and verify your email</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500 mt-0.5"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 font-sans">Project Requirements</h4>
                      <p className="text-sm text-gray-600 mt-1 font-sans">Tell us about your project goals and requirements</p>
                    </div>
                  </div>

                  <button className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors mt-6 bg-emerald-600 font-sans">
                    Submit Onboarding Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderDashboard();
      case 1: return renderChecklists();
      case 2: return renderSubmissions();
      case 3: return renderCustomerView();
      case 4: return renderBranding();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoHeader />
      <div className="pt-20">
        {/* Small refresh button */}
        <div className="fixed top-24 right-4 z-50">
          <button
            onClick={() => {
              setCurrentStep(0);
              setProgress(0);
              setAnimatedStats({ users: 0, completed: 0, rate: 0, days: 0 });
              setAnimatedProgress({});
              setCompletedSteps([]);
              setIsPlaying(true);
            }}
            className="bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="Restart demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}