import React from 'react';
import { CheckCircle, Link, BarChart3, Smartphone, Palette, Eye, Users, Clock, Target, Plus, Edit, Send, Copy, Building, Mail, Upload, ArrowRight, Star, Workflow } from 'lucide-react';

export default function Features() {
  return (
    <>
      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Detailed breakdown of how OnboardFlo transforms your customer onboarding process
            </p>
          </div>

          {/* Feature 1: Dashboard Analytics */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Real-Time Analytics Dashboard</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Get instant visibility into your customer onboarding performance. Track completion rates, 
                  identify bottlenecks, and see live customer activity as it happens.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Live customer activity tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Completion rate analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Average completion time metrics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Customer progress visualization</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
                    <h4 className="text-xl font-bold font-sans">Dashboard</h4>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900 font-sans">127</div>
                        <div className="text-xs text-gray-600 font-sans">Active Clients</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900 font-sans">94%</div>
                        <div className="text-xs text-gray-600 font-sans">Completion Rate</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900 font-sans">2.8d</div>
                        <div className="text-xs text-gray-600 font-sans">Avg. Time</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Activity */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900 font-sans">Live Activity</h5>
                      <div className="flex items-center text-xs text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="font-sans">Live</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'Sarah M.', status: '✓ Uploaded assets', progress: 87 },
                        { name: 'Marcus C.', status: 'Working on requirements', progress: 62 },
                        { name: 'Emily R.', status: 'Reviewing concepts', progress: 78 }
                      ].map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                          <div>
                            <div className="font-medium text-gray-900 text-sm font-sans">{client.name}</div>
                            <div className="text-xs text-gray-600 font-sans">{client.status}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full"
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-700 font-sans">{client.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Template System */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Template Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <Plus className="w-5 h-5" />
                      </div>
                      <h4 className="text-xl font-bold font-sans">Choose Your Template</h4>
                    </div>
                  </div>
                  
                  {/* Template Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'Website Design', icon: '🎨', color: '#3b82f6', steps: 5 },
                        { name: 'Web Development', icon: '💻', color: '#10b981', steps: 6 },
                        { name: 'Marketing Campaign', icon: '📈', color: '#ef4444', steps: 7 },
                        { name: 'E-commerce Setup', icon: '🛒', color: '#f59e0b', steps: 8 }
                      ].map((template, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors cursor-pointer">
                          <div className="flex items-center mb-2">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-2"
                              style={{ backgroundColor: `${template.color}20` }}
                            >
                              {template.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm font-sans">{template.name}</div>
                              <div className="text-xs text-gray-500 font-sans">{template.steps} steps</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-xs text-gray-500 ml-1 font-sans">(4.9)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Professional Templates</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Start with proven templates designed for different industries and use cases. 
                  Each template includes optimized steps and completion flows.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">6 industry-specific templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Customizable for your needs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Start from scratch option</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Proven completion rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3: Checklist Builder */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <Edit className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Intuitive Checklist Builder</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Build comprehensive onboarding flows with multiple step types. From simple checkboxes 
                  to file uploads and detailed forms - create exactly what your customers need.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">6 different step types</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Drag & drop reordering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Required vs optional steps</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Custom completion messages</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Builder Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold font-sans">Website Design Project Onboarding</h4>
                      <button className="bg-emerald-500 text-white px-3 py-1 rounded text-sm font-sans">
                        Publish
                      </button>
                    </div>
                  </div>
                  
                  {/* Steps List */}
                  <div className="p-4 space-y-3">
                    {[
                      { title: 'Project Discovery', type: 'textarea', icon: '📝', required: true },
                      { title: 'Brand Assets', type: 'file_upload', icon: '📎', required: true },
                      { title: 'Content & Copy', type: 'file_upload', icon: '📎', required: true },
                      { title: 'Design References', type: 'textarea', icon: '📝', required: true },
                      { title: 'Technical Requirements', type: 'textarea', icon: '📝', required: true }
                    ].map((step, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm mr-2">{step.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 text-sm font-sans">{step.title}</div>
                              <div className="flex items-center mt-1">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-sans">
                                  {step.type === 'textarea' ? 'Long Text' : 'File Upload'}
                                </span>
                                {step.required && (
                                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-sans">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Customer Experience */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Customer Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <h4 className="text-lg font-bold font-sans">Website Design Project Onboarding</h4>
                    <p className="text-blue-100 text-sm font-sans">Complete these steps to get started</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-100 font-sans">Progress</span>
                        <span className="text-sm font-medium text-blue-100 font-sans">3/5 completed</span>
                      </div>
                      <div className="w-full bg-blue-400/30 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-lg font-bold text-white font-sans">60%</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Step */}
                  <div className="p-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📝</span>
                        <div>
                          <h5 className="font-bold text-gray-900 font-sans">Step 4: Design References</h5>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium font-sans">
                            Required
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 font-sans">Share inspiration and style preferences</p>
                      <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
                        <textarea
                          value="We love Stripe's clean aesthetic and Tableau's data visualization style. Modern, professional, trustworthy."
                          className="w-full border-0 focus:outline-none text-gray-800 resize-none font-sans text-sm"
                          rows={3}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Completed Steps */}
                    <div className="mt-4 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h6 className="font-semibold text-emerald-900 mb-3 font-sans">Completed Steps (3/5)</h6>
                      <div className="space-y-2">
                        {[
                          'Project Discovery',
                          'Brand Assets', 
                          'Content & Copy'
                        ].map((step, index) => (
                          <div key={index} className="flex items-center text-sm text-emerald-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-sans">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Seamless Customer Experience</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Your customers get a beautiful, mobile-friendly experience with clear progress tracking. 
                  No accounts needed - just click the link and start completing steps.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Visual progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Mobile-responsive design</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">No login required</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Real-time collaboration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 5: Submissions Tracking */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Customer Submissions Tracking</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Monitor all customer submissions in one place. See who's making progress, 
                  who needs help, and send targeted reminders to keep everyone on track.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Real-time status updates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Individual progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Automated reminder system</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Shareable customer links</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Submissions Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 font-sans">Customer Submissions</h4>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 font-sans">12</div>
                        <div className="text-xs text-gray-600 font-sans">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 font-sans">3</div>
                        <div className="text-xs text-gray-600 font-sans">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 font-sans">4</div>
                        <div className="text-xs text-gray-600 font-sans">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600 font-sans">5</div>
                        <div className="text-xs text-gray-600 font-sans">Done</div>
                      </div>
                    </div>
                  </div>

                  {/* Customer List */}
                  <div className="p-4 space-y-3">
                    {[
                      { name: 'Sarah Martinez', company: 'HealthTech', status: 'In Progress', progress: 87, color: 'blue', active: true },
                      { name: 'Marcus Chen', company: 'StartupXYZ', status: 'Completed', progress: 100, color: 'emerald', active: false },
                      { name: 'Emily Rodriguez', company: 'GrowthCo', status: 'Pending', progress: 0, color: 'orange', active: false }
                    ].map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="font-medium text-gray-900 text-sm font-sans">{customer.name}</div>
                              {customer.active && (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                  <span className="text-xs text-green-600 font-sans">Active</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <div className="flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                <span className="font-sans">{customer.company}</span>
                              </div>
                              <span className={`text-${customer.color}-600 font-sans`}>{customer.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-2">
                            <div className="flex items-center">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                  className={`bg-${customer.color}-500 h-1.5 rounded-full`}
                                  style={{ width: `${customer.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-700 font-sans">{customer.progress}%</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                              <Eye className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-emerald-600 rounded">
                              <Copy className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-emerald-600 rounded">
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Brand Customization */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Branding Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 font-sans">Brand Settings</h4>
                  </div>
                  
                  {/* Settings Panel */}
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Logo URL</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value="https://company.com/logo.png"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans"
                          readOnly
                        />
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-sans">
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Primary Color</label>
                        <div className="flex space-x-2 items-center">
                          <div className="w-8 h-8 bg-blue-500 border border-gray-300 rounded-lg"></div>
                          <input
                            type="text"
                            value="#3b82f6"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Secondary Color</label>
                        <div className="flex space-x-2 items-center">
                          <div className="w-8 h-8 bg-blue-600 border border-gray-300 rounded-lg"></div>
                          <input
                            type="text"
                            value="#2563eb"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Font Family</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans">
                        <option>Montserrat (Default)</option>
                      </select>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <h5 className="text-sm font-medium text-gray-700 mb-3 font-sans">Live Preview</h5>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-1 bg-blue-500"></div>
                      <div className="p-3 text-center bg-blue-50">
                        <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                        <h6 className="font-bold text-gray-900 text-sm font-sans">Your Checklist</h6>
                        <p className="text-xs text-gray-600 font-sans">Branded experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <Palette className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Complete Brand Customization</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Make every checklist feel like a natural extension of your brand. Upload your logo, 
                  set custom colors, and choose fonts that match your company's style.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Custom logo upload</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Brand color customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Font family selection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Live preview updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 7: Step Types */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 font-sans">Multiple Step Types</h3>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-sans">
                Create rich, interactive onboarding experiences with 6 different step types. 
                From simple checkboxes to file uploads and detailed forms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  type: 'Checkbox',
                  icon: '☑️',
                  description: 'Simple yes/no confirmations',
                  example: 'I agree to the terms of service'
                },
                {
                  type: 'Text Input',
                  icon: '📝',
                  description: 'Short text responses',
                  example: 'Company name, phone number'
                },
                {
                  type: 'Long Text',
                  icon: '📄',
                  description: 'Detailed descriptions',
                  example: 'Project requirements, goals'
                },
                {
                  type: 'File Upload',
                  icon: '📎',
                  description: 'Document and asset collection',
                  example: 'Brand guidelines, contracts'
                },
                {
                  type: 'Website URL',
                  icon: '🔗',
                  description: 'Link collection and validation',
                  example: 'Current website, social profiles'
                },
                {
                  type: 'Email Address',
                  icon: '📧',
                  description: 'Email validation and collection',
                  example: 'Team member contacts'
                }
              ].map((stepType, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-3">{stepType.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-900 font-sans">{stepType.type}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 font-sans">{stepType.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1 font-sans">Example:</div>
                    <div className="text-sm text-gray-700 font-sans">{stepType.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 8: Completion Experience */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Completion Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-bold font-sans">Outstanding Work, Sarah! 🎉</h4>
                      <p className="text-emerald-100 font-sans">Your website project onboarding is complete!</p>
                    </div>
                  </div>

                  {/* Completion Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 font-sans">5/5</div>
                        <div className="text-sm text-gray-600 font-sans">Steps Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 font-sans">1.8</div>
                        <div className="text-sm text-gray-600 font-sans">Days to Complete</div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 font-sans">🚀 What happens next?</h5>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                            <CheckCircle className="w-2 h-2 text-white" />
                          </div>
                          <p className="font-sans">Design team review within 24 hours</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                            <CheckCircle className="w-2 h-2 text-white" />
                          </div>
                          <p className="font-sans">Initial wireframes by Friday</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                            <CheckCircle className="w-2 h-2 text-white" />
                          </div>
                          <p className="font-sans">Kickoff call next week</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 font-sans">Delightful Completion Experience</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 font-sans">
                  Celebrate customer success with personalized completion pages. Set clear expectations 
                  for next steps and maintain momentum in your relationship.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Custom completion messages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Completion time tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Next steps guidance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700 font-sans">Branded completion pages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}