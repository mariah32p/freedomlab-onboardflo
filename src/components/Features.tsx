import React from 'react';
import { CheckCircle, Users, Bell, BarChart3, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Visual Progress Tracking',
    description: 'Beautiful progress bars and step indicators that show customers exactly where they are in the onboarding process.',
  },
  {
    icon: Bell,
    title: 'Automated Reminders',
    description: 'Smart email and in-app notifications that gently nudge customers to complete their setup without being pushy.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Multiple team members can collaborate on customer onboarding with role-based permissions and activity tracking.',
  },
  {
    icon: CheckCircle,
    title: 'Completion Analytics',
    description: 'Detailed insights into where customers drop off and which steps need improvement to optimize your flow.',
  },
  {
    icon: Clock,
    title: 'Time-to-Value Optimization',
    description: 'Reduce time-to-first-value with streamlined flows that get customers to their "aha moment" faster.',
  },
  {
    icon: Shield,
    title: 'Reduce Support Load',
    description: 'Clear guidance and proactive help reduce support tickets by up to 60% during the onboarding phase.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need for
            <span className="block text-indigo-600">seamless onboarding</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OnboardFlo provides all the tools you need to create, manage, and optimize 
            customer onboarding experiences that drive engagement and reduce churn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}