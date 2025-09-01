import React from 'react';
import { CheckCircle, Link, BarChart3, Smartphone, Palette, Eye } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: CheckCircle,
      title: 'Visual Checklist Builder',
      description: 'Create professional onboarding flows in minutes with our simple form builder.',
    },
    {
      icon: Link,
      title: 'Shareable Links',
      description: 'Send customers a simple URL - no logins required, just click and complete.',
    },
    {
      icon: Eye,
      title: 'Progress Tracking',
      description: 'Know exactly where each customer stands in real-time.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-Friendly',
      description: 'Clean, responsive checklist pages that work perfectly on any device.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'See completion rates and identify where customers need help.',
    },
    {
      icon: Palette,
      title: 'Brand Consistency',
      description: 'Add your logo and colors to maintain professional appearance.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sans">
            Everything you need for smooth onboarding
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
            Simple tools that work for any business
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}