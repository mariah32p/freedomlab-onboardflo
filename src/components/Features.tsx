import React from 'react';
import { CheckCircle, Users, Bell, BarChart3, Clock, Shield } from 'lucide-react';

export default function Features() {
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

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to onboard customers successfully
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to streamline your customer onboarding process and maximize engagement
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors group">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
